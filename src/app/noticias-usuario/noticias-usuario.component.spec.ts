import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasUsuarioComponent } from './noticias-usuario.component';

describe('NoticiasUsuarioComponent', () => {
  let component: NoticiasUsuarioComponent;
  let fixture: ComponentFixture<NoticiasUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiasUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
