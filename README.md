# Sistema de Reserva de Salas de Reunião - Connect Coworking

##  Descrição do Projeto
O **Sistema de Reserva de Salas de Reunião** é uma aplicação desenvolvida para gerenciar o agendamento de salas em um coworking fictício chamado **Connect Coworking**.  
O objetivo é substituir o processo manual via e-mail, evitando conflitos de horários e salas aparentemente ocupadas.  

O sistema permite:
- Cadastro e gerenciamento de salas (CRUD);
- Cadastro e gerenciamento de reservas;
- Visualização das reservas diárias de cada sala;
- Controle de conflitos de horários;
- Diferencial: visualização em formato de calendário semanal (opcional).

---

##  Público-Alvo
- **Administrador:**  
  - Gerencia todas as salas (CRUD).  
  - Pode visualizar e cancelar qualquer reserva.  

- **Usuário Comum:**  
  - Consulta a disponibilidade das salas.  
  - Agenda reservas para si dentro do horário disponível.

---

##  Funcionalidades (MVP)
1. **Gerenciamento de Salas (CRUD)**  
   - Nome da sala  
   - Capacidade  
   - Recursos disponíveis (ex: projetor, TV, quadro branco)  

2. **Gerenciamento de Reservas**  
   - Associação entre usuário, sala e intervalo de tempo (data, hora de início e fim)  
   - Validação para evitar conflitos de horário  

3. **Visualização de Reservas**  
   - Lista diária de reservas por sala  

4. **Bônus (Diferencial)**  
   - Visualização das reservas em formato de calendário semanal

---

##  Tecnologias Utilizadas
- **Front-end:** Next.js, React, CSS  
- **Back-end:** Node.js, Next.js API Routes  
- **Banco de Dados:** MongoDB  
- **Controle de versão:** Git / GitHub  

## Requisitos Funcionais
- O sistema deve permitir cadastro, edição e exclusão de salas;
- O sistema deve permitir cadastro, edição e exclusão de reservas;
- Usuários comuns devem poder criar reservas apenas para horários disponíveis;
- Administradores devem poder visualizar todas as reservas e cancelá-las;
- O sistema deve mostrar lista diária de reservas por sala;
- Visualização das reservas em calendário semanal.

## Requisitos não funcionais
- O sistema deve ser responsivo e funcionar em desktop e mobile;
- O tempo de resposta da aplicação deve ser menor que 2 segundos para qualquer operação CRUD;
- Os dados devem ser armazenados de forma segura no MongoDB;
- O sistema deve ter autenticação segura com criptografia de senhas;
- Código organizado.

## Limitações
- Não há integração com notificações por e-mail ainda;
- Calendário semanal é opcional e pode não estar totalmente funcional no MVP;
- Falta controle de permissões avançado além de usuário comum e administrador.

## Melhorias futuras
- Implementar notificações por e-mail para reservas;
- Melhorar visualização em calendário semanal com cores para cada sala;
- Criar relatórios de ocupação diária/semanal;
- Adicionar permissões granulares (ex: gerente, equipe, visitante);
- Implementar integração com Google Calendar ou Outlook.

## Link FIGMA:
    - https://www.figma.com/design/pTOLniNICR06IOtCKwquVy/Untitled?node-id=0-1&m=dev&t=8dB9mjwhBY06ds5N-1
    


