import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteAboutusComponent } from './website-aboutus.component';

describe('WebsiteAboutusComponent', () => {
  let component: WebsiteAboutusComponent;
  let fixture: ComponentFixture<WebsiteAboutusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteAboutusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteAboutusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
