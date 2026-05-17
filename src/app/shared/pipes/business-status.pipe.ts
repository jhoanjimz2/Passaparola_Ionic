import { Pipe, PipeTransform } from '@angular/core';
import { DateTime }            from 'luxon';

@Pipe({
  name: 'businessStatus',
  pure: true,
  standalone: true
})
export class BusinessStatusPipe implements PipeTransform {
  transform(business: any): { hasSchedule: boolean, open: boolean, closesAt?: string } {

    // 👉 Caso: NO existe ningún horario
    if (!business?.schedule?.length || !business?.countryCode) {
      return { hasSchedule: false, open: false };
    }

    const timezones: Record<string, string> = {
      BR: 'America/Sao_Paulo',
      CO: 'America/Bogota',
      ES: 'Europe/Madrid',
      FR: 'Europe/Paris',
      IT: 'Europe/Rome',
      PT: 'Europe/Lisbon',
      RO: 'Europe/Bucharest'
    };

    const timezone = timezones[business.countryCode] || 'UTC';
    const now = DateTime.now().setZone(timezone);
    const today = now.weekday; // 1=lunes ... 7=domingo

    // buscar el horario de HOY
    const todaySchedule = business.schedule.find((d: any) =>
      this.mapDay(d.dayOfWeek.relation) === today
    );

    // 👉 Caso: hoy no tiene horarios, pero sí existen en otros días
    if (!todaySchedule || !todaySchedule.schedule?.length) {
      return { hasSchedule: true, open: false };
    }

    // 👉 Revisar los slots del día actual
    for (const slot of todaySchedule.schedule) {
      const start = DateTime.fromFormat(slot.start, 'HH:mm', { zone: timezone });
      const end = DateTime.fromFormat(slot.end, 'HH:mm', { zone: timezone });

      if (now >= start && now <= end) {
        return { hasSchedule: true, open: true, closesAt: slot.end };
      }
    }

    // 👉 Tiene horario hoy pero está cerrado
    return { hasSchedule: true, open: false };
  }

  private mapDay(day: string): number {
    const map: Record<string, number> = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7
    };
    return map[day.toLowerCase()] || 0;
  }
}
