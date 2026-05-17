import { CommonModule }                 from '@angular/common';
import { Component, Input }             from '@angular/core';
import { FormsModule }                  from '@angular/forms';
import { Capacitor }                    from '@capacitor/core';
import { Keyboard }                     from '@capacitor/keyboard';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule }              from '@ngx-translate/core';
import { CompanyScheduleDay }           from 'src/app/shared/interfaces/schedule/company-schedule-day';
import { DayAvailability, Schedule }    from 'src/app/shared/interfaces/schedule/day-availability';

@Component({
  selector: 'app-seat-schedule',
  templateUrl: './seat-schedule.component.html',
  styleUrls: ['./seat-schedule.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonicModule, CommonModule, FormsModule]
})
export class SeatScheduleComponent {
  @Input() schedule: DayAvailability[] = [];
  @Input() daysTranslation: CompanyScheduleDay[] = [];

  private showListener: any;
  private hideListener: any;
  keyboardIsOpen = false;

  daySelection: DayAvailability | null = null;
  hours: string[] = [];

  applySameSchedule = false;
  private backupState: { [relation: string]: { isOpen: boolean; schedule: Schedule[] } } = {};

  private lastOpenSchedules: { [relation: string]: Schedule[] } = {};

  constructor(
    private modalController: ModalController
  ) {
    if (Capacitor.isNativePlatform()) {
      this.showListener = Keyboard.addListener('keyboardWillShow', () => {
        this.keyboardIsOpen = true;
      });

      this.hideListener = Keyboard.addListener('keyboardWillHide', () => {
        this.keyboardIsOpen = false;
      });
    }
  }

  ngOnInit() {
    this.schedule = this.schedule ?? [];
    this.daysTranslation = this.daysTranslation ?? [];
    this.getHours();
    this.normalizeSchedule();
  }

  ngOnDestroy() {
    this.showListener?.remove?.();
    this.hideListener?.remove?.();
  }

  /** Utilidad para clonar schedules profundamente */
  private cloneSchedules(list: Schedule[]): Schedule[] {
    return list.map(s => ({
      start: s.start,
      end: s.end,
      hourStart: [...s.hourStart],
      hourEnd: [...s.hourEnd],
    }));
  }

  getHours() {
    for (let i = 0; i < 24; i++) this.hours.push(i.toString().padStart(2, '0') + ':00');
  }

  normalizeSchedule() {
    const result: DayAvailability[] = [];

    this.daysTranslation.forEach(day => {
      const found = this.schedule.find(s => s.dayOfWeek.relation === day.description);
      if (found) {
        result.push(found);
      } else {
        result.push({
          isOpen: false,
          dayOfWeek: {
            id: day.companyScheduleDayTranslation[0].id,
            relation: day.description,
            description: day.companyScheduleDayTranslation[0].description,
            languageCode: day.companyScheduleDayTranslation[0].languageCode
          },
          schedule: []
        });
      }
    });

    this.schedule = result;
    this.daySelection = this.schedule[0];
  }

  onSelectTab(day: CompanyScheduleDay) {
    const match = this.schedule.find(s => s.dayOfWeek.relation === day.description);
    if (match) this.daySelection = match;
  }


  updateChecked(event: Event) {
    if (!this.daySelection) return;

    const checked = (event.target as HTMLInputElement).checked;
    const rel = this.daySelection.dayOfWeek.relation;

    if (checked) {
      // 👇 Guardar horario antes de cerrar
      if (this.daySelection.schedule.length > 0) {
        this.lastOpenSchedules[rel] = this.cloneSchedules(this.daySelection.schedule);
      } else if (!this.lastOpenSchedules[rel]) {
        this.lastOpenSchedules[rel] = [{
          start: '09:00',
          end: '18:00',
          hourStart: this.hours.filter(h => parseInt(h) <= 17),
          hourEnd:   this.hours.filter(h => parseInt(h) >= 10),
        }];
      }
      this.daySelection.isOpen = false;
      this.daySelection.schedule = [];

    } else {
      // 👇 Reabrir
      this.daySelection.isOpen = true;
      const backup = this.lastOpenSchedules[rel];
      this.daySelection.schedule = backup?.length
        ? this.cloneSchedules(backup)
        : [{
            start: '09:00',
            end: '18:00',
            hourStart: this.hours.filter(h => parseInt(h) <= 17),
            hourEnd:   this.hours.filter(h => parseInt(h) >= 10),
          }];
    }

    // 👇 NUEVO: si "aplica a todos" está activo, propaga
    if (this.applySameSchedule) {
      const refIsOpen = this.daySelection.isOpen;
      const refSchedule = this.cloneSchedules(this.daySelection.schedule);

      this.schedule.forEach(day => {
        day.isOpen = refIsOpen;
        day.schedule = this.cloneSchedules(refSchedule);
      });
    }
  }


  onChangeHour(type: 'start' | 'end', value: string, schedule: Schedule) {
    schedule[type] = value;
  }

  toggleApplySameSchedule() {
    if (!this.daySelection) return;

    if (this.applySameSchedule) {
      this.backupState = this.schedule.reduce((acc, day) => {
        acc[day.dayOfWeek.relation] = {
          isOpen: day.isOpen,
          schedule: this.cloneSchedules(day.schedule)
        };
        return acc;
      }, {} as { [relation: string]: { isOpen: boolean; schedule: Schedule[] } });

      const refIsOpen = this.daySelection.isOpen;
      const refSchedule = this.cloneSchedules(this.daySelection.schedule);

      this.schedule.forEach(day => {
        day.isOpen = refIsOpen;
        day.schedule = this.cloneSchedules(refSchedule);
      });

    } else {
      this.schedule.forEach(day => {
        const backup = this.backupState[day.dayOfWeek.relation];
        if (backup) {
          day.isOpen = backup.isOpen;
          day.schedule = this.cloneSchedules(backup.schedule);
        }
      });
      this.backupState = {};
    }
  }

  addSchedule() {
    if (!this.daySelection) return;

    const newSchedule: Schedule = {
      start: '09:00',
      end: '18:00',
      hourStart: this.hours.filter(h => parseInt(h) <= 17),
      hourEnd:   this.hours.filter(h => parseInt(h) >= 10)
    };

    this.daySelection.isOpen = true;
    this.daySelection.schedule.push(newSchedule);
  }

  onCancel() {
    this.modalController.dismiss();
  }

  onSave() {
    this.modalController.dismiss({ schedule: this.schedule });
  }
}
