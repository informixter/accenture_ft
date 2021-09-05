SERVER=65.108.53.187

build:
	 docker-compose build jupyter

stop:
	docker-compose down -v

run_local:
	docker-compose up -d postgres jupyter php nginx

run_prod:
	docker-compose up -d

init:
	docker-compose exec -T jupyter bash -c 'papermill extractors.ipynb /root/output/extractors.ipynb'
	docker-compose exec -T jupyter bash -c 'papermill lg-exp.ipynb /root/output/lg-exp.ipynb'
	docker-compose exec -T php bash -c 'composer install'



git-fix:
	git add .
	git commit -m "deploy commit `date +%Y_%m_%d"_"%H_%M_%S`"
	git push origin main

deploy: git-fix
	ssh -i keys/id_rsa -t root@$(SERVER) 'cd accenture_ft && make stop'
	ssh -i keys/id_rsa -t root@$(SERVER) 'cd accenture_ft && git pull origin main '
	ssh -i keys/id_rsa -t root@$(SERVER) 'cd accenture_ft && make run'

enter:
	ssh -i keys/id_rsa root@$(SERVER)
