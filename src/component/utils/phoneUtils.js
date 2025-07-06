export const formatUzbekPhone = (raw) => {
    let digits = raw.replace(/\D/g, "");


    if (digits.startsWith("998")) {
        digits = digits.slice(3);
    }

    digits = digits.slice(0, 9);

    if (digits.length === 0) return "";

    let formatted = "+998";
    if (digits.length > 0) formatted += " " + digits.slice(0, 2);
    if (digits.length >= 3) formatted += " " + digits.slice(2, 5);
    if (digits.length >= 6) formatted += " " + digits.slice(5, 7);
    if (digits.length >= 8) formatted += " " + digits.slice(7, 9);

    return formatted;
};