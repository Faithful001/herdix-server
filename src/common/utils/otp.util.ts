class OtpUtil {
  constructor() {}

  public generate() {
    const length = 6;
    const numbers = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      otp += numbers.charAt(randomIndex);
    }
    return otp;
  }
}

export default new OtpUtil();
