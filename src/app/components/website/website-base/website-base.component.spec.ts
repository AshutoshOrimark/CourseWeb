import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteBaseComponent } from './website-base.component';

describe('WebsiteBaseComponent', () => {
  let component: WebsiteBaseComponent;
  let fixture: ComponentFixture<WebsiteBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
