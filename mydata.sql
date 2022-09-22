CREATE table plans (
    id serial primary key,
    plan_name varchar(255) not null,
    sms_price integer not null,
    call_price integer not null,
    unique (plan_name)
);
CREATE table addUser (
    id serial primary key,
    name varchar(255) not null,
    price_plan varchar(255) not null,
    FOREIGN KEY (price_plan) REFERENCES plans (plan_name)
);
-- ERROR:  there is no unique constraint matching given keys for referenced table "plans"
-- SQL state: 42703
-- Detail: Key (price_plan)=(plan1) is not present in table "plans".

INSERT INTO plans (plan_name, sms_price, call_price)
VALUES ('sms100', 1, 2);
INSERT INTO plans (plan_name, sms_price, call_price)
VALUES ('call100', 2, 3);
INSERT INTO plans (plan_name, sms_price, call_price)
VALUES ('text-me', 3, 4);

