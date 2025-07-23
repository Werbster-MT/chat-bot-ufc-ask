const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Dashboard Page', function () {
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

  afterEach(async function () {
    await driver.get('http://localhost:3000/');
  });

  it('deve adicionar um novo chat ao fazer uma pergunta', async function () {
    const askInput = await driver.wait(
        until.elementLocated(By.id('userQuery')),
        60000 // espera até 20 segundos para o elemento aparecer
      );
      await driver.wait(until.elementIsVisible(askInput), 60000); // espera até 10 segundos para ficar visível
    await askInput.sendKeys('O que é a UFC ?')

    // Clica no botão "Adicionar"
    let sendButton = await driver.findElement(By.css('button[type="submit"] i.fa-arrow-right'));
    await sendButton.click()
     
    // Aguarda a mensagem de Sucesso aparecer
    const message = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'IA')]")),
        60000
    );
    
    await driver.wait(until.elementIsVisible(message), 60000);
    const text = await message.getText();
    
    assert(text.includes('IA'));
  }),

  it('deve retornar a pagina principal ao clicar no botão de nova pergunta', async function () {
    const askInput = await driver.wait(
        until.elementLocated(By.id('userQuery')),
        20000 // espera até 20 segundos para o elemento aparecer
      );
    await driver.wait(until.elementIsVisible(askInput), 10006); // espera até 10 segundos para ficar visível
    await askInput.sendKeys('O que é o PET ?')

    // Clica no botão "Adicionar"
    let sendButton = await driver.findElement(By.css('button[type="submit"] i.fa-arrow-right'));
    await sendButton.click()
     
    // Aguarda a novo chat aparecer
    const message = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'IA')]")),
        60000
    );
    
    await driver.wait(until.elementIsVisible(message), 60000);
    
    let newAskButton = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Iniciar nova conversa')]")),
        60000
      );

    await newAskButton.click();

    let title = await driver.getTitle()
    assert(title.includes('Home Estudante'), 'A tela de Home Estudante não foi carregada corretamente.')
  })
});
