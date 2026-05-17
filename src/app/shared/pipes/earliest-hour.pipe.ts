import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'earliestHour',
  pure: false // Permite que el pipe se actualice cuando se agreguen eventos
})
export class EarliestHourPipe implements PipeTransform {
  transform(scheduleEvents: { date: string; hourStart: string }[]): string {
    if (!scheduleEvents || scheduleEvents.length === 0) {
      return 'No hour available';
    }

    // Ordenar por fecha y hora
    const sortedEvents = scheduleEvents
      .map(event => ({
        ...event,
        dateTime: new Date(`${event.date}T${event.hourStart}`)
      }))
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

    // Obtener la hora del primer evento
    return sortedEvents[0].hourStart;
  }
}
