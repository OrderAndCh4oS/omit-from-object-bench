import benny from 'benny';
import {faker} from "@faker-js/faker";

function omitOne<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    ...excludes: K[]
): Omit<T, K> {
    const result: Partial<T> = {};
    const keys = Object.keys(obj) as K[];
    for (const key of keys) {
        if (!excludes.includes(key)) {
            result[key] = obj[key];
        }
    }

    return result as Omit<T, K>;
}

function omitOneAlt<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    ...excludes: K[]
): Omit<T, K> {
    const result: Partial<T> = {};

    for (const key in obj) {
        if (!excludes.includes(key as unknown as K)) {
            result[key] = obj[key];
        }
    }

    return result as Omit<T, K>;
}

function omitTwo<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    ...excludes: K[]
): Omit<T, K> {
    const result: Partial<T> = Object.assign({}, obj);

    for (const key of excludes) delete result[key];

    return result as Omit<T, K>;
}

function omitThree<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    ...excludes: K[]
): Omit<T, K> {
    const entries = Object.entries(obj).filter(([key]) => !excludes.includes(key as K));

    return Object.fromEntries(entries) as Omit<T, K>;
}

const obj: Record<string, Record<string, number>> = {};

const keys = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

for (let i = 0; i < 10; i++) {
    const objTwo: Record<string, number> = {};
    for (let j = 0; j < 10; j++) {
        objTwo[keys[j]] = Math.random();
    }
    obj[keys[i]] = objTwo;
}

benny.suite(
    'Omit half of properties from a 10x10 object with string values',

    // benny.add('omitOne', () => {
    //     omitOne(obj, 'one', 'three', 'five', 'seven', 'nine');
    // }),

    // benny.add('omitTwo', () => {
    //     omitTwo(obj, 'one', 'three', 'five', 'seven', 'nine');
    // }),
    //
    // benny.add('omitThree', () => {
    //     omitThree(obj, 'one', 'three', 'five', 'seven', 'nine');
    // }),

    benny.add('omitOneAlt', () => {
        omitOneAlt(obj, 'one', 'three', 'five', 'seven', 'nine');
    }),

    benny.add('Destructuring assignment', () => {
        const {one, three, five, seven, nine, ...evenFour} = obj;
    }),

    benny.cycle(),
    benny.complete(),
);

benny.suite(
    'Omit one property from a 10x10 object with string values',

    // benny.add('omitOne', () => {
    //     omitOne(obj, 'one');
    // }),

    // benny.add('omitTwo', () => {
    //     omitTwo(obj, 'one');
    // }),
    //
    // benny.add('omitThree', () => {
    //     omitThree(obj, 'one');
    // }),

    benny.add('omitOneAlt', () => {
        omitOneAlt(obj, 'one');
    }),

    benny.add('Destructuring assignment', () => {
        const {one, ...evenFour} = obj;
    }),

    benny.cycle(),
    benny.complete(),
);

/**
 * Realistic Large Data
 */


const createUserObject = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        company: faker.company.name(),
        jobTitle: faker.person.jobTitle(),
        industry: faker.company.buzzNoun(),
        address: {
            street: faker.location.street(),
            city: faker.location.city(),
            state: faker.location.state(),
            zip: faker.location.zipCode(),
            country: faker.location.country()
        },
        dob: faker.date.birthdate({ max: 50, min: 18, mode: 'year' }).toISOString().split('T')[0],
        ssn: faker.finance.accountNumber(9),
        taxId: faker.finance.accountNumber(12),
        taxStatus: 'non-exempt',
        taxClassification: ['individual', 'corporation', 'non-profit'][faker.number.int({ min: 0, max: 2 })],
        creditCardNumber: faker.finance.creditCardNumber(),
        currency: faker.finance.currencyCode(),
        paymentMethod: ['card', 'bank_transfer', 'paypal'][faker.number.int({ min: 0, max: 2 })],
        security: {
            password: faker.internet.password(),
            twoFactorEnabled: faker.datatype.boolean(),
            lastLogin: faker.date.recent().toISOString(),
            loginAttempts: faker.number.int({ min: 0, max: 10 })
        }
    };
};

const objTwo = createUserObject();

benny.suite(
    'Omit various properties from a realistic large object',

    // benny.add('omitOne', () => {
    //     omitOne(objTwo, 'address', 'security', 'company', 'phoneNumber', 'jobTitle', 'email');
    // }),

    // benny.add('omitTwo', () => {
    //     omitTwo(objTwo, 'address', 'security', 'company', 'phoneNumber', 'jobTitle', 'email');
    // }),
    //
    // benny.add('omitThree', () => {
    //     omitThree(objTwo, 'address', 'security', 'company', 'phoneNumber', 'jobTitle', 'email');
    // }),

    benny.add('Destructuring assignment', () => {
        const {address, security, company, phoneNumber, jobTitle, email, ...evenFour} = objTwo;
    }),

    benny.add('omitOneAlt', () => {
        omitOneAlt(objTwo, 'address', 'security', 'company', 'phoneNumber', 'jobTitle', 'email');
    }),

    benny.cycle(),
    benny.complete(),
);

benny.suite(
    'Omit one property from a realistic large object',

    // benny.add('omitOne', () => {
    //     omitOne(objTwo, 'address');
    // }),

    // benny.add('omitTwo', () => {
    //     omitTwo(objTwo, 'address');
    // }),
    //
    // benny.add('omitThree', () => {
    //     omitThree(objTwo, 'address');
    // }),

    benny.add('Destructuring assignment', () => {
        const {address, ...evenFour} = objTwo;
    }),

    benny.add('omitOneAlt', () => {
        omitOneAlt(objTwo, 'address');
    }),

    benny.cycle(),
    benny.complete(),
);

/**
 * Small obj
 */

const createSmallUserObject = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.animal.bird() + ':' + faker.animal.insect()
    };
};

const objThree = createSmallUserObject();

benny.suite(
    'Omit one property from a realistic small object',

    // benny.add('omitOne', () => {
    //     omitOne(objThree, 'password');
    // }),

    // benny.add('omitTwo', () => {
    //     omitTwo(objThree, 'password');
    // }),
    //
    // benny.add('omitThree', () => {
    //     omitThree(objThree, 'password');
    // }),

    benny.add('omitOneAlt', () => {
        omitOneAlt(objThree, 'password');
    }),

    benny.add('Destructuring assignment', () => {
        const {password, ...evenFour} = objThree;
    }),

    benny.cycle(),
    benny.complete(),
);