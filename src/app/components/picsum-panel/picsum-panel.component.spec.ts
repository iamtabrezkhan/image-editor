import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicsumPanelComponent } from './picsum-panel.component';

describe('PicsumPanelComponent', () => {
  let component: PicsumPanelComponent;
  let fixture: ComponentFixture<PicsumPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicsumPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicsumPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
