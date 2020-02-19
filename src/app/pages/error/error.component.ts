import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ErrorStatus} from '../../helpers/errorStatus';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

  id: number;
  subscribe: Subscription[] = [];
  ErrorSatus = ErrorStatus;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.subscribe.push(this.route.params.subscribe((params) => {
      const idNumber = Number(params.id);
      this.id = this.checkError(idNumber);
    }));
  }

  ngOnDestroy(): void {
    this.subscribe.map((sub) => sub.unsubscribe());
  }

  checkError(id: number): ErrorStatus {
    if (isNaN(id)) {
      return ErrorStatus.INTERNAL_SERVER_ERROR;
    }
    const val = ErrorStatus[id];
    return val ? ErrorStatus[val] : ErrorStatus.INTERNAL_SERVER_ERROR;
  }
}
