import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteTestimonialsComponent } from './website-testimonials.component';

describe('WebsiteTestimonialsComponent', () => {
  let component: WebsiteTestimonialsComponent;
  let fixture: ComponentFixture<WebsiteTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteTestimonialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
