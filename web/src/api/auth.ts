import { post } from './http';

export interface SmsSendResp {
  code: string;
  ttl: number;
}

export interface SmsVerifyResp {
  token: string;
  user_id: number;
  is_new_user: boolean;
  onboarding_complete: boolean;
}

export const authApi = {
  sendSms(phone: string) {
    return post<SmsSendResp>('/auth/sms/send', { phone });
  },
  verifySms(phone: string, code: string) {
    return post<SmsVerifyResp>('/auth/sms/verify', { phone, code });
  },
  logout() {
    return post<object>('/auth/logout');
  },
};
