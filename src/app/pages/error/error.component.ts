import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

  id: string;
  subscribe: Subscription[] = [];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.subscribe.push(this.route.params.subscribe((params) => this.id = params.id));
  }

  ngOnDestroy(): void {
    this.subscribe.map((sub) => sub.unsubscribe());
  }
}
