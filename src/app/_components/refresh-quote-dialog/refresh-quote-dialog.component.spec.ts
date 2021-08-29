import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshQuoteDialogComponent } from './refresh-quote-dialog.component';

describe('RefreshQuoteDialogComponent', () => {
  let component: RefreshQuoteDialogComponent;
  let fixture: ComponentFixture<RefreshQuoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefreshQuoteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshQuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
