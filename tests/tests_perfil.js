const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

// Testes para Perfil Page
describe('Perfil Page', function () {
  let driver;

  // Aumenta o timeout padrão do Mocha
  this.timeout(60000);

  // Setup
  const options = new chrome.Options();
  options.addArguments('--start-maximized');
  before(async function () {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  // Teardown
  after(async function () {
    if (driver) await driver.quit();
  });

  // beforeEach: faz login como estudante antes de cada teste
  beforeEach(async function () {
    await driver.get('http://localhost:3000/');
    let email = await driver.wait(
        until.elementLocated(By.name('email')),
        60000
      );
    let password = await driver.wait(
        until.elementLocated(By.name('password')),
        60000
      );
    let button = await driver.wait(
        until.elementLocated(By.css('button[type="submit"]')),
        60000
      );
    await email.sendKeys('werbster.teixeira@alu.ufc.br');
    await password.sendKeys('teste123');
    await button.click();
  });

  // afterEach: volta para a tela inicial após cada teste
  afterEach(async function () {
    await driver.get('http://localhost:3000/');
  });

  // Teste: deve permitir acessar a página de perfil do usuário
  it('deve permitir acessar a página de perfil do usuário', async function () {
    // Clica no botão "Adicionar"
    let perfilButton = await driver.findElement(By.css('.btn-perfil'));
    await perfilButton.click()
     
    let title = await driver.getTitle()
    assert(title.includes('Meu Perfil'), 'A tela de Meu Perfil não foi carregada corretamente.')
  }),

  // Teste: deve exibir a confirmação de exclusão de conta ao clicar no botão de lixeira
  it('deve exibir a confirmação de exclusão de conta ao clicar no botão de lixeira', async function () {
    // Acessa a página de perfil e clica no botão de exclusão
    let perfilLink = await driver.wait(
        until.elementLocated(By.css('a[href="/perfil"]')),
        60000
      );
    await perfilLink.click();
    
    let deleteButton = await driver.wait(
        until.elementLocated(By.css('.delete-account')),
        60000
      );
    await deleteButton.click();

    // Aguarda a mensagem de confirmação
    const message = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Tem certeza que deseja excluir sua conta?')]")),
        60000
      );

    await driver.wait(until.elementIsVisible(message), 60000);
    const text = await message.getText();
    
    assert(text.includes('Tem certeza que deseja excluir sua conta?'));
  })
});
