import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WesiteFooterComponent } from './wesite-footer.component';

describe('WesiteFooterComponent', () => {
  let component: WesiteFooterComponent;
  let fixture: ComponentFixture<WesiteFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WesiteFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WesiteFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
