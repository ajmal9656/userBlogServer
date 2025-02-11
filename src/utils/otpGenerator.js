function generateOtp(num) {
    const min = Math.pow(10, num - 1);
    const max = Math.pow(10, num) - 1;
    return Math.floor(min + Math.random() * (max - min)).toString();
}

export default generateOtp;