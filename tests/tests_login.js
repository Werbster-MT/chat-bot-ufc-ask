const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

// Testes para Login Page
describe('Login Page', function () {
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

  // Teste: deve logar com sucesso com credenciais válidas
  it('deve logar com sucesso com credenciais válidas', async function () {
    // Acessa a página de login e preenche os campos
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

    // Aguarda redirecionamento para dashboard ou página do estudante
    await driver.wait(until.urlContains('/dashboard'), 60000);
    const url = await driver.getCurrentUrl();

    assert(url.includes('/dashboard') || url.includes('/studentHomePage'));
  });

  // Teste: deve gerar erro ao logar com credenciais inválidas
  it('deve gerar erro ao logar com credenciais inválidas', async function () {
    // Acessa a página de login e preenche os campos com senha inválida
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
    await password.sendKeys('senha_invalida');
    await button.click();

    await driver.sleep(1000);

    // Aguarda mensagem de erro
    let toast = await driver.wait(
        until.elementLocated(By.id('toast-body')),
        60000
      );
    await driver.wait(until.elementIsVisible(toast), 60000);
    let toastText = await toast.getText();

    assert(toastText.includes('Usuário ou Senha incorretos.'), 'A mensagem de erro não foi exibida corretamente.');
  })

  // Teste: deve avançar para a tela de redefinição de senha após receber o código
  it('deve avançar para a tela de redefinição de senha após receber o código', async function () {
    // Fluxo de recuperação de senha
    await driver.get('http://localhost:3000/');
    // Clica no link "Esqueci minha senha"
    let link = await driver.wait(
        until.elementLocated(By.linkText('Esqueci minha senha')),
        60000
      );
    await link.click();

    // Aguarda a página de recuperação
    await driver.wait(until.urlContains('/manage-access?action_type=password'), 60000);

    // Preenche o campo de email
    let email = await driver.wait(
        until.elementLocated(By.name('email')),
        60000
      );
    await email.sendKeys('werbster.teixeira@alu.ufc.br'); // Use um email válido

    // Clica no botão "Próximo"
    let button = await driver.wait(
        until.elementLocated(By.css('button[type="submit"], button')),
        60000
      );
    await button.click();

    // Aguarda a tela "Um código foi enviado ao seu email"
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Um código foi enviado ao seu email')]")),
      60000
    );

    // Clica no botão "Próximo" dessa tela
    let nextButton = await driver.wait(
        until.elementLocated(By.css('button[type="submit"], button')),
        60000
      );
    await nextButton.click();

    // Aguarda a tela de redefinição de senha (campos: código, senha, confirmar senha)
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(@placeholder,'Código') or contains(@placeholder,'Senha')]")),
      60000
    );

    // Verifica se a tela de redefinição de senha foi carregada
    const bodyText = await driver.findElement(By.css('body')).getText();
    assert(
      bodyText.includes('Redefinir Senha') ||
      bodyText.includes('Digite o Código Recebido') ||
      bodyText.includes('Digite sua Senha') ||
      bodyText.includes('Digite sua Senha Novamente'),
      'A tela de redefinição de senha não foi carregada corretamente.'
    );
  });

  // Teste: deve fazer logout
  it('deve fazer logout', async function () {
    // Faz login e depois logout
    await driver.get('http://localhost:3000/')

    // Encontra os elementos da tela de login
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

    // Preenche o campo de email e senha
    await email.sendKeys('admin@ufc.br')
    await password.sendKeys('admin123')
    await button.click()
    
    // Clica no botão "Sair"
    let logoutButton = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Sair')]")),
        60000
      );
    await driver.wait(until.elementIsVisible(logoutButton), 60000);
    await logoutButton.click()
     
    // Aguarda a tela de login de senha ser carregada
    await driver.wait(until.urlContains('/'), 60000);

    // Verifica se a tela de login de senha foi carregada
    let title = await driver.getTitle()
    assert(title.includes('Login'), 'A tela de login não foi carregada corretamente.')
  })
});
