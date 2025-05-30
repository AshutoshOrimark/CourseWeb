import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteCarouselComponent } from './website-carousel.component';

describe('WebsiteCarouselComponent', () => {
  let component: WebsiteCarouselComponent;
  let fixture: ComponentFixture<WebsiteCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
