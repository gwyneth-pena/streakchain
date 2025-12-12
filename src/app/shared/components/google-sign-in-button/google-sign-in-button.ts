import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-google-sign-in-button',
  imports: [],
  templateUrl: './google-sign-in-button.html',
  styleUrl: './google-sign-in-button.scss',
})
export class GoogleSignInButton {
  @Output() googleTokenId = new EventEmitter<any>();

  ngOnInit() {
    document.cookie = 'g_state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    setTimeout(() => {
      this.initializeGoogleClient();
    }, 200);
  }

  initializeGoogleClient() {
    const google = (window as any).google;
    google?.accounts?.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      use_fedcm_for_prompt: false,
      auto_select: false,
      cancel_on_tap_outside: false,
      callback: (response: any) => {
        this.googleTokenId.emit(response.credential);
      },
    });

    google.accounts.id.renderButton(document.getElementById('google-signin-button'), {
      theme: 'filled_black',
      size: 'large',
      type: 'standard',
      text: 'continue_with',
      locale: 'en',
      width: 250,
    });
  }
}
