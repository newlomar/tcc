# TCC

## O problema:

Como garantir que pessoas em situação de emergência consigam disparar mensagens de SOS a ponto de exigir pouca interação para esse número de mensagens, mas que ainda assim consiga alcançar os contatos de emergência, contatos esses que podem ser um grande número de pessoas.

## A Hipótese

Se tivermos um aplicativo ativado por rede de dados, wi-fi e bluetooth seria possível emitir um alerta a partir do click de um dispositivo simples, com apenas um botão, para esse aplicativo que, em seguida, dispararia a mensagem de SOS para um pool de contatos previamente cadastrado

## Comentários gerais

- Contador de clicks de volume (alteração de volume) para dizer se está em perigo ou não

LOOK FOR WEB HID Library, as I cant interact with the HID Service from the AB Shutter 3 device by the web Bluetooth API:

- https://wicg.github.io/webhid/

- https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API

- https://stackoverflow.com/questions/77750301/hid-over-bluetooth-le-in-javascript

Arquitetura

- Objetivo: a arquitetura precisa ser o mais confiável possível, para as mensagens inevitávelmenet serem entregues e, além disso, é fundalmental que ela seja rápida. Por esse motivo, ela precisa ser o mais confiável possível, funcionar indepentente de problemas externos e ter alternativas (fallback);
  - Pensar em soluções caso alguma das camadas não esteja funcionando;
  - Monitoramento
  - Alarmes
- SQS
- SNS
- Testes automatizados - TDD - Cypress
  Adicionar tela tanto para a configuração de conexão com o dispositivo bluetooth, quanto para ser um subscriber da comunicação de um usuário

Fazer o aplicativo ativar a localização caso esteja desativada no celular

A API de bluetooth não é simpleszinha

Possibilidade de IA

Verificar uma forma de o dispositivo que se conecta via bluethooth conseguir ligar o bluetooth do celular ou algo do tipo

- Verificar se deixar o bluetooth ligado gasta muita bateria do celuar

Sinalizador de celular com bateria acabando (colocar como feature opcional)

- Quando o celular estiver com a bateria acabando e prestes a desligar, o aplicativo manda uma mensagem para os "subscribers" (listerners, ouvintes, tanto faz)

Adicionar possibilidade de criar comandos específicos, por exemplo:

- Um click, executa o comando padrão
- Dois clicks rápidos, executa um comando customizável, dentro dos comandos possíveis
- Três clicks rápidos, executa uma outra coisa
- etc

- Adicionar dispositivo a um chaveiro

- EM CASO DE Não HAVER INTERNET / Indisponibilidade no serviço que recebe a mensagem (SQS por exemplo)

  - sucessão(sequência) de funções fallbacks para resolver o problema
  - salvar as informações localização localmente no telefone para que, assim que o sinal for reestabelicido, a aplicação já consuma e envie a informação para os ouvintes, não dependendo de um novo click.

- Criar um dispositivo próprio

  - Que funcione como chaveiro e a forma de informar que está em situação de SOS seja fácil de fazer com as mãos no bolso, porém, ao mesmo tempo, que não fique perceptível que é um dispositivo com essa funcionalidade e que garanta que, uma vez que alterado para SOS, que a mensagem seja distribuída.

  - Além disso, o dispositivo tem que ter uma bateria de longa duração, ser fácil de se conectar via bluetooth, **usar um serviço e uma característica que seja permitidos, sem permissão a nível de sistema!!!!!!!!**

## Utilidades

https://academy.nordicsemi.com/courses/bluetooth-low-energy-fundamentals/lessons/lesson-1-bluetooth-low-energy-introduction/

https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps

https://developer.chrome.com/docs/capabilities/bluetooth

Blueooth HID not Allowed for "non-system" apps:

- https://stackoverflow.com/questions/76451356/getting-java-lang-securityexception-need-bluetooth-privileged-permission-when

- https://stackoverflow.com/questions/77979707/flutter-android-need-bluetooth-privileged-permission
