const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const path = require('path');

// Testes para Dashboard Page
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

  // beforeEach: faz login como admin antes de cada teste
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
    await email.sendKeys('admin@ufc.br');
    await password.sendKeys('admin123');
    await button.click();
  });

  // afterEach: volta para a tela inicial após cada teste
  afterEach(async function () {
    await driver.get('http://localhost:3000/');
  });

  // Teste: deve adicionar um novo link de documento
  it('deve adicionar um novo link de documento', async function () {
    // Preenche o campo de link
    let documentLink = await driver.findElement(By.id('documentLink'))
    await documentLink.sendKeys('https://cc.ufc.br/pt/sobre-o-curso/')

    // Clica no botão "Adicionar"
    let addButton = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Adicionar')]")),
        60000
      );
    await addButton.click()
     
    // Aguarda a mensagem de Sucesso aparecer
    const message = await driver.wait(
    until.elementLocated(By.id("toast-body")),
    60000
    );
    
    await driver.wait(until.elementIsVisible(message), 60000);
    const text = await message.getText();
    
    assert(text.includes('Fonte adicionada com sucesso'));
  })

  // Teste: deve adicionar um novo PDF
  it('deve adicionar um novo PDF', async function () {
    // Preenche o campo de upload de arquivo
    const documentFile = await driver.wait(
        until.elementLocated(By.id('documentFile')),
        60000
      );

    // Caminho absoluto do arquivo
    const filePath = path.resolve(__dirname, 'files', 'ufc_pdf.pdf');
    await documentFile.sendKeys(filePath);

    // Clica no botão "Adicionar"
    let addButton = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Adicionar')]")),
        60000
      );
    await addButton.click();

    // Aguarda a mensagem de Sucesso aparecer
    const message = await driver.wait(
      until.elementLocated(By.id("toast-body")),
      60000
    );  

    await driver.wait(until.elementIsVisible(message), 60000);
    const text = await message.getText();
    
    assert(text.includes('Fonte adicionada com sucesso'));
  }),

  // Teste: deve gerar erro ao adicionar sem link ou PDF
  it('deve gerar erro ao adicionar sem link ou PDF', async function () {
    // Clica no botão "Adicionar" sem preencher campos
    let addButton = await driver.findElement(By.xpath("//button[contains(., 'Adicionar')]"));
    await driver.wait(until.elementIsVisible(addButton), 60000);
    await addButton.click();

    await driver.sleep(1000);

    // Aguarda a mensagem de erro aparecer 
    const message = await driver.wait(
    until.elementLocated(By.id("swal2-html-container")),
    60000
    );

    await driver.wait(until.elementIsVisible(message), 60000);
    const text = await message.getText();

    // Verifica se a mensagem de erro aparece
    assert(text.includes('Preencha um dos campos (link ou arquivo PDF)'));
  })
});
