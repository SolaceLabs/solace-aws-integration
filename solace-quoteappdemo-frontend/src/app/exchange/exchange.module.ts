import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfSummaryComponent } from './perf-summary/perf-summary.component';
import { LivedataPanelComponent } from './livedata-panel/livedata-panel.component';
import { MessagePanelComponent } from './message-panel/message-panel.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import {NgMathPipesModule} from 'angular-pipes';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgMathPipesModule
  ],
  declarations: [PerfSummaryComponent, LivedataPanelComponent, MessagePanelComponent, ControlPanelComponent],
  exports: [PerfSummaryComponent, LivedataPanelComponent, MessagePanelComponent, ControlPanelComponent]
})
export class ExchangeModule { }
