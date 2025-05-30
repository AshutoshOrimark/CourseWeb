import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitePricingComponent } from './website-pricing.component';

describe('WebsitePricingComponent', () => {
  let component: WebsitePricingComponent;
  let fixture: ComponentFixture<WebsitePricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsitePricingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsitePricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
