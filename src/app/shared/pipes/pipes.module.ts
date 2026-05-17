import { NgModule }              from '@angular/core';
import { CommonModule }          from '@angular/common';

import { ImagePipe }             from './image.pipe';
import { MaskNumberAccountPipe } from './mask-number-account.pipe';
import { ImageEventPipe }        from './image-event.pipe';
import { DateSortPipe }          from './date-sort.pipe';
import { TimeFormatPipe }        from './time-format.pipe';
import { DateFilterPipe }        from './date-filter.pipe';
import { FormatDateRangePipe }   from './format-date-range.pipe';
import { EarliestHourPipe }      from './earliest-hour.pipe';
import { MinPricePipe }          from './min-price.pipe';
import { SumQuantityPipe }       from './sum-quantity.pipe';
import { SortByDatePipe }        from './sort-by-date.pipe';

@NgModule({
  declarations: [ImagePipe, ImageEventPipe, MaskNumberAccountPipe, DateSortPipe,TimeFormatPipe, DateFilterPipe, FormatDateRangePipe, EarliestHourPipe, MinPricePipe, SumQuantityPipe, SortByDatePipe],
  imports: [CommonModule],
  exports: [ImagePipe, ImageEventPipe, MaskNumberAccountPipe, DateSortPipe, TimeFormatPipe, DateFilterPipe, FormatDateRangePipe, EarliestHourPipe, MinPricePipe, SumQuantityPipe, SortByDatePipe],
})
export class PipesModule {}
