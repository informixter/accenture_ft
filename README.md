#### Демо
Демо сервиса доступно по адресу: [https://investhelper.insrt.ru/](https://investhelper.insrt.ru/)

Пользователь не требуется

<h4>Основной стек технологий:</h4>
<ul>
    <li>Jupyter Notebook, Papermill</li>
	<li>PHP 7, PostgresSql.</li>
	<li>React, HTML, CSS, JavaScript, TypeScript.</li>
	<li>Git, Docker.</li>
 </ul>

#### Среда запуска
1) развертывание сервиса производится на debian-like linux (debian 9+);
2) требуется установленный docker-compose;
3) требуется установленный build-essential

УСТАНОВКА
------------
### Установка пакетoв build-essential и git 
```shell
apt-get update
apt-get upgrade
apt-get install build-essential git
```


### Установка пакета docker-compose
```shell
apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
 $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update && apt-get install docker-ce docker-ce-cli containerd.io -y

apt-cache madison docker-ce

curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

docker-compose --version
```

### Установка проекта
переходим в домашнию папку
```shell
cd ~/
```
клонируем проект и переходим в папку
```shell
git clone https://github.com/informixter/accenture_ft.git && cd accenture_ft
```
Запуск проекта после запуска проект доступен на локальной магине [http://localhost:8080]()
```shell
make run
```

Оставновка проекта
```shell
make stop
```


РАЗРАБОТЧИКИ
<h4>Бережнов Дмитрий fullstack https://t.me/berezh </h4>
<h4>Константин Михайлов аналитик/алгоритмы https://t.me/trackrecordsnavigator </h4>
<h4>Попов Дмитрий fullstack https://t.me/informix </h4>
