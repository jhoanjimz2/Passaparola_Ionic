import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DailyCheckIn } from 'src/app/shared/interfaces/daily-checkin/daily-ckeck-in.interface';
import { WalletService } from '../../../../shared/services/wallet.service';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  totalReward = 0;
  today = new Date();
  year = 0;
  years: number[] = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  month = 0;
  calendar: any[] = [];
  days: any[] = [
    {
      day: 1,
      name: 'DAYS.MONDAY',
    },
    {
      day: 2,
      name: 'DAYS.TUESDAY',
    },
    {
      day: 3,
      name: 'DAYS.WEDNESDAY',
    },
    {
      day: 4,
      name: 'DAYS.THURSDAY',
    },
    {
      day: 5,
      name: 'DAYS.FRIDAY',
    },
    {
      day: 6,
      name: 'DAYS.SATURDAY',
    },
    {
      day: 7,
      name: 'DAYS.SUNDAY',
    },
  ];
  months: any[] = [
    {
      month: 1,
      name: 'MONTHS.JANUARY',
    },
    {
      month: 2,
      name: 'MONTHS.FEBRUARY',
    },
    {
      month: 3,
      name: 'MONTHS.MARCH',
    },
    {
      month: 4,
      name: 'MONTHS.APRIL',
    },
    {
      month: 5,
      name: 'MONTHS.MAY',
    },
    {
      month: 6,
      name: 'MONTHS.JUNE',
    },
    {
      month: 7,
      name: 'MONTHS.JULY',
    },
    {
      month: 8,
      name: 'MONTHS.AUGUST',
    },
    {
      month: 9,
      name: 'MONTHS.SEPTEMBER',
    },
    {
      month: 10,
      name: 'MONTHS.OCTOBER',
    },
    {
      month: 11,
      name: 'MONTHS.NOVEMBER',
    },
    {
      month: 12,
      name: 'MONTHS.DECEMBER',
    },
  ];
  @Input() dailyCheckIns: DailyCheckIn[] = [];
  user: User | undefined;
  isCheckToday = false;
  wallet: Wallet | undefined;

  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private walletService: WalletService
  ) {
    const user = localStorage.getItem('appPassaparola_user');
    this.user = user ? JSON.parse(user) : undefined;
  }

  ngOnInit() {
    this.year = this.today.getFullYear();
    this.month = this.today.getMonth();
    this.calendar = this.getCalendarDates(this.year, this.month);
  }

  close() {
    this.modalController.dismiss();
  }

  findDefaultWallet() {
    this.walletService.findDefaultWallet(this.user?.userID!).subscribe({
      next: (response) => {
        this.wallet = response;
        this.getCheckInStatus();
        this.checkIfTodayIsCheckedIn();
        this.totalReward = this.getCheckedInDaysForCurrentMonth().length;
      },
    });
  }

  getDailyCheckIn() {
    this.walletService
      .getDailyCheckIns(this.user?.userID!, this.month + 1, this.year)
      .subscribe({
        next: (response) => {
          this.dailyCheckIns = response;
          this.findDefaultWallet();
          this.getCheckInStatus();
          this.checkIfTodayIsCheckedIn();
          this.totalReward = this.getCheckedInDaysForCurrentMonth().length;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getCalendarDates(
    year: number,
    month: number
  ): {
    date: Date;
    dayName: string;
    dayNumber: number;
    formattedDate: string;
    monthDay: number;
    checkIn: boolean;
  }[] {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    const startDay = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1; // Lunes es 0
    const calendarDates: {
      date: Date;
      dayName: string;
      dayNumber: number;
      formattedDate: string;
      monthDay: number;
      checkIn: boolean;
    }[] = [];

    let dayPointer = new Date(year, month, 1 - startDay);

    while (dayPointer <= monthEnd || dayPointer.getDay() !== 1) {
      const formattedDate = formatDate(dayPointer, 'yyyy-MM-dd', 'en-US');
      const monthDay = dayPointer.getDate();

      calendarDates.push({
        date: new Date(dayPointer),
        dayName:
          daysOfWeek[dayPointer.getDay() === 0 ? 6 : dayPointer.getDay() - 1],
        dayNumber: dayPointer.getDay() === 0 ? 7 : dayPointer.getDay(),
        formattedDate: formattedDate,
        monthDay: monthDay,
        checkIn: false,
      });
      dayPointer.setDate(dayPointer.getDate() + 1);
    }

    // this.getDailyCheckIn();
    this.findDefaultWallet();

    return calendarDates;
  }

  isDateBefore(formattedDate: string): boolean {
    const currentDate = new Date();
    const targetDate = new Date(formattedDate);

    currentDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    return currentDate < targetDate;
  }

  isDateEqual(formattedDate: string): boolean {
    const currentDate = new Date();
    const targetDate = new Date(formattedDate);

    currentDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    return currentDate.getTime() === targetDate.getTime();
  }

  getFirstCharacter(value: string) {
    const valueTranslate = this.translate.instant(value);
    if (valueTranslate && valueTranslate.length > 0) {
      return valueTranslate.charAt(0);
    } else {
      return '';
    }
  }

  getCheckInStatus() {
    this.calendar.forEach((day) => {
      day.checkIn = this.dailyCheckIns.some(
        (checkin) => checkin.date === day.formattedDate
      );
    });
  }

  createCheckIn(day: any) {
    if (this.isCheckToday) return;
    if (!this.isDateEqual(day.formattedDate)) return;

    const request: DailyCheckIn = {
      userId: this.user?.userID!,
      amount: 1,
      walletTo: this.wallet?.id!,
      date: day.formattedDate,
      countryCode: this.user?.countryCode!,
    };

    this.walletService.createDailyCheckIn(request).subscribe({
      next: (response) => {
        this.getDailyCheckIn();
        this.getWalletById(response.walletTo!);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  checkIfTodayIsCheckedIn() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const checkIn of this.dailyCheckIns) {
      const checkInDate = new Date(checkIn.date);
      checkInDate.setHours(0, 0, 0, 0);

      if (currentDate.getTime() === checkInDate.getTime()) {
        this.isCheckToday = true;
        return;
      }
    }

    this.isCheckToday = false;
  }

  getCheckedInDaysForCurrentMonth() {
    // return this.calendar.filter((day) => {
    //   const dayMonth = new Date(day.date).getMonth() + 1;
    //   return day.checkIn && dayMonth === this.month + 1;
    // });
    return this.calendar.filter((day) => {
      return day.checkIn;
    });
  }

  getWalletById(walletId: string) {
    this.walletService.findWalletById(walletId).subscribe({
      next: (response) => {
        this.walletService.myWalletSet(response);
      },
    });
  }
}
