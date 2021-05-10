# Should start automating build

( # frontend
    cd frontend
    yarn run build
    pm2 restart main:frontend
)&

( # backend
    cd frontend
    yarn run build
    pm2 restart main:frontend
)&
