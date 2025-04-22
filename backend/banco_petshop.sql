create database petshop;
use petshop;

create table user(
id int primary key auto_increment,
email varchar(500),
senha varchar(500)
)
select*from user;

create table agendamento(
id int primary key auto_increment,
nome varchar(500),
raca varchar(500),
data_agendamento datetime not null,
observacoes text,
filename varchar(500)
)