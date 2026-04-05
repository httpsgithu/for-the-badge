export function luhnCheckDigit(digits : string) : number
{
    let sum = 0;
    let shouldDouble = true;
    for (let i = digits.length - 1; i >= 0; i--)
    {
        let d = parseInt(digits[i], 10);
        if (shouldDouble)
        {
            d *= 2;
            if (d > 9)
            {
                d -= 9;
            }
        }
        sum += d;
        shouldDouble = !shouldDouble;
    }
    const mod = sum % 10;

    return mod === 0 ? 0 : 10 - mod;
}

export function isValidLuhn(number : string) : boolean
{
    if (!/^\d+$/.test(number) || number.length < 2)
    {
        return false;
    }
    const body = number.slice(0, -1);
    const check = parseInt(number[number.length - 1], 10);

    return luhnCheckDigit(body) === check;
}

export function generateLuhnNumber() : string
{
    const digits = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join("");
    const checkDigit = luhnCheckDigit(digits);

    return digits + checkDigit;
}