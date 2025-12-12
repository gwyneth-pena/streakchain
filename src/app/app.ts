import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Header } from "./shared/components/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
