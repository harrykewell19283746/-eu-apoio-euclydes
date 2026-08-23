# Eu Apoio Euclydes 1015

Versão independente e estática do gerador de foto de apoio. Não usa banco de dados, servidor ou login. A foto escolhida é processada somente no navegador do visitante.

## Arquivos

- `index.html`: estrutura da página.
- `styles.css`: identidade visual e adaptação para celular.
- `script.js`: upload, zoom, reposicionamento, aplicação da moldura e download.
- `assets/frame.png`: moldura oficial aplicada sobre a foto.
- `assets/og.png`: imagem usada ao compartilhar o link.

## Hospedagem

Não há etapa de compilação. Envie `index.html`, `styles.css`, `script.js` e a pasta `assets` para a pasta pública da hospedagem, normalmente chamada `public_html`, `www` ou `htdocs`.

Também é possível publicar em qualquer serviço de hospedagem estática. Preserve exatamente a estrutura das pastas.

## Domínio

Após contratar o domínio, aponte-o para a hospedagem conforme os registros DNS informados pelo provedor. Sugestão de endereço: `euapoioeuclydes1015.com.br`.

## Teste local

Abra um terminal nesta pasta e execute um servidor estático, por exemplo:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080` no navegador.
