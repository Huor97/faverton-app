---
applyTo: '**'
---

## Config
test e2e dans `playwright.config.ts`
```TS
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: `./app/tests/e2e`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: `html`,
  use: {
    baseURL: `http://localhost:3000`,
    trace: `on-first-retry`,
  },
  projects: [
    {
      name: `chromium`,
      use: { ...devices[`Desktop Chrome`] },
    },
  ],
  webServer: {
    command: `pnpm run dev`,
    url: `http://localhost:3000`,
    reuseExistingServer: !process.env.CI,
  },
});
```

Ajoute des scripts pour exécuter les tests :
```json
"scripts": {
  "test:unit": "vitest tests/unit/",
  "test:e2e": "vitest tests/e2e/",
  "test:all": "vitest"
}
```

# Commands

```Shell
# run once
pnpm test:unit

# watch mode
pnpm test

# 🔁 Exécution des tests d'intégration (sans mode watch)
pnpm test:integration

# 🧪 Tests end-to-end (E2E) avec Playwright
pnpm test:e2e

# 🐞 Tests E2E avec mode débogage (pas-à-pas, breakpoints, console visible)
pnpm test:e2e:debug

# 👁️ Interface interactive de Playwright pour lancer les tests E2E manuellement
pnpm test:e2e:ui

# 📊 Affiche le rapport HTML des tests E2E déjà exécutés
pnpm test:e2e:report

# 🧹 Nettoyage des résultats de tests E2E et des rapports générés
pnpm test:e2e:clean

# 🧹 Nettoyage des fichiers E2E générés depuis Git (utile si ajoutés par erreur)
pnpm test:e2e:clean-git

# ✅ Vérifications complètes avant CI :
#   - tests unitaires
#   - tests d'intégration
#   - tests end-to-end
pnpm test:all
```

## Arborescence

```shell
app/
├── pages/
│   ├── user/
│   │   ├── page.vue
│   │   ├── page.test.ts        ← ✅ Test unitaire de la page
├── components/
│   ├── UserAuthLogin.vue
│   ├── UserAuthLogin.test.ts    ← ✅ Test du composant
└── tests/
    ├── e2e/
    │   ├── __mocks__/
    │   │   ├── auth/
    │   │   │   ├── users-valid.json
    │   │   │   ├── users-invalid.json
    │   │   │   └── auth-responses.json
    │   │   └── supabase/
    │   │       └── auth-client.json
    │   ├── user/
    │   │   ├── login.e2e.spec.ts  ← ✅ Test de bout en bout
```

## Pourquoi séparer vitest/Playwright ?

1. **Outils différents** : [Playwright](https://playwright.dev/docs) et Vitest sont des outils distincts avec des configurations spécifiques
2. **Types de tests différents** :
    - Vitest → tests unitaires/intégration
    - Playwright → tests e2e
3. **Environnements différents** : Configurations et dépendances distinctes


---

Voici la **traduction critique et adaptée** de cette section, avec des ajustements pour l’intégrer dans un projet Nuxt 3 utilisant **Nuxt UI** (donc avec un composant comme `UInput` à la place de `IadDataTable`) :

---

## 🧪 Tester des composants

---

## ✍️ Exemple de test simple de composant

Dans un fichier `./components.test.ts` :

```ts
import { shallowMount } from '@vue/test-utils'
import TestPage from './test.vue'

describe('TestPage', () => {
  test('rendu basique', () => {
    const wrapper = shallowMount(TestPage)
    expect(wrapper.find('div').exists()).toBe(true)
  })
})
```

---

## 🧩 Tester les slots nommés

Il arrive que l’on veuille tester le contenu d’un **slot nommé**.  
Or, `shallowMount` **ne rend pas** les slots enfants par défaut.  
Il faut alors **désactiver le stub** pour certains composants précis.

Par exemple, ici on veut tester un `UInput` avec un slot personnalisé :

```ts
import { shallowMount } from '@vue/test-utils'

describe('TestPage', () => {
  test('rendu du slot de UInput', () => {
    const wrapper = shallowMount(TestPage, {
      global: {
        // on rend complètement UInput au lieu de le stubber
        //// shallowMount everything BUT fully render IadDataTable
        stubs: { UInput: false }
      }
    })

    // Exemple de vérification du contenu injecté dans un slot
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe('Entrer une valeur')
  })
})
```


---
## Qu'est-ce qu'un Spy (Espion) ?

Un **spy** est un outil de test qui remplace une fonction existante pour :

1. **Enregistrer** tous les appels (arguments, nombre d'appels, etc.)
2. **Contrôler** ce que la fonction retourne
3. **Vérifier** comment elle a été utilisée
## Métaphore Simple

```ts
Vraie méthode = Employé normal qui fait son travail
Spy = Employé remplaçant qui :
  ✓ Fait le travail demandé (retourne une valeur contrôlée)
  ✓ Note tout dans un carnet (qui a appelé, avec quels arguments)
```

## Exemple Pratique

1. Création du Spy
```ts
// Remplace la vraie méthode par un spy
const mockSignIn = vi.spyOn(vm.supabase.auth, 'signInWithPassword')
  .mockResolvedValue({ error: null });
```

2. Ce que le Spy Enregistre Automatiquement
```ts
// Le spy crée automatiquement un "carnet" avec :
mockSignIn.mock = {
  calls: [],           // Tous les appels avec leurs arguments
  instances: [],       // Contexte des appels
  invocationCallOrder: [], // Ordre des appels
  results: []          // Résultats retournés
}
```

3. Quand le Composant Appelle la Méthode
```ts
<!-- Dans le composant -->
await supabase.auth.signInWithPassword({
  email: "valid@email.com",
  password: "correctpassword"
});
```

**Le spy enregistre automatiquement :**
```ts
mockSignIn.mock.calls[0] = [{
  email: "valid@email.com",
  password: "correctpassword"
}];
```

## Vérifications Possibles avec les Spies

Vérifier les Arguments Exacts
```ts
expect(mockSignIn).toHaveBeenCalledWith({
  email: "valid@email.com",
  password: "correctpassword",
});
```

Vérifier le Nombre d'Appels
```ts
expect(mockSignIn).toHaveBeenCalledTimes(1);
```

Vérifier qu'il a été Appelé
```ts
expect(mockSignIn).toHaveBeenCalled();
```

Vérifier qu'il N'a PAS été Appelé
```ts
expect(mockSignIn).not.toHaveBeenCalled();
```

Accéder aux Arguments Directement
```ts
expect(mockSignIn.mock.calls[0][0].email).toBe("valid@email.com");
```

## Différence : Spy vs Fonction Normale
### Sans Spy ❌
```ts
const normalFunction = () => { return { error: null }; };
// ❌ Impossible de savoir si elle a été appelée
// ❌ Impossible de connaître les arguments
```
### Avec Spy ✅
```ts
const spy = vi.spyOn(obj, 'method').mockResolvedValue({ error: null });
// ✓ Sait tout sur ses appels
// ✓ Peut vérifier les arguments
// ✓ Peut compter les appels
```

## Exemple Complet de Test
```ts
test('redirige vers /simulator en cas de succès', async () => {
  const wrapper = shallowMount(UserAuthLogin);
  const vm = wrapper.vm as any;

  // 1. Créer le spy
  const mockSignIn = vi.spyOn(vm.supabase.auth, 'signInWithPassword')
    .mockResolvedValue({ error: null });

  // 2. Configurer les données
  vm.email = 'valid@email.com';
  vm.password = 'correctpassword';

  // 3. Exécuter l'action
  await vm.login();
  await flushPromises();

  // 4. Vérifier que le spy a été appelé correctement
  expect(mockSignIn).toHaveBeenCalledWith({
    email: 'valid@email.com',
    password: 'correctpassword',
  });

  // 5. Vérifier le comportement du composant
  expect(vm.error).toBe('');
  expect(vm.message).toBe('Connexion réussie');
});
```

## Résumé

Un spy vous donne **deux pouvoirs** :

1. **Contrôler** ce que la méthode retourne (`.mockResolvedValue()`)
2. **Vérifier** comment elle a été utilisée (`.toHaveBeenCalledWith()`)

C'est pourquoi vous pouvez écrire [expect(mockSignIn).toHaveBeenCalledWith(...)](vscode-file://vscode-app/snap/code/194/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) - le spy a **automatiquement enregistré** tous les détails de l'appel !


---
## Handling events

- `vm.$emit()` always followed by a nextTick()
- `trigger()` always awaited

```ts
import { shallowMount } from '@vue/test-utils';

import TestPage from './test.vue';

describe(`Test page`, () => {
  test(`rendering`, async () => {
    expect(TestPage).toBeTruthy();
    const wrapper = shallowMount(TestPage);
    const inputComponent = wrapper.findComponent(UInput);
    expect(inputComponent.exists()).toBe(true);
    inputComponent.vm.$emit(`update:modelValue`, `my input value`);
    // mandatory `await nextTick();`
    await nextTick();
    const button = wrapper.find(`button`);
    expect(button.exists()).toBe(true);
    // mandatory `await` before trigger
    await button.trigger(`click`);
    // … rest of the test
  });
});
```

## Handling defineModels

`defineModel` act as a `ref` is the expected props isn't passed.

This will work:

```ts
it(`should close the popup on button click`, async () => {
  const wrapper = shallowMount(DeleteModal, { props: { modelValue: true } } );
  const dialog = wrapper.findComponent(UDialog);
  await expect(wrapper.findComponent(UButton).trigger(`click`);
  expect(wrapper.emitted(`update:modelValue`)).toEqual([[false]]);
});
```

This will not:

```ts
it(`should close the popup on button click`, async () => {
  // The “modelValue” isn't defined, defineModel will act a ref
  const wrapper = shallowMount(DeleteModal);
  const dialog = wrapper.findComponent(UModal);
  await expect(wrapper.findComponent(UButton).trigger(`click`);
  expect(wrapper.emitted(`update:modelValue`)).toBeUndefined();
});
```

It seems that vue-test utils buttons references inside actions won't update

```ts
it(`can delete a property`, async (context) => {
  const wrapper = shallowMount(DiscoveryListDeleteDialog, {
    // Unstub dialog to be able to test “#actions” slot
    global: { stubs: { UModal: false } },
  });
  // If we keep this reference and use it along the test, props won't be updated
  const confirmBtn = wrapper.findAllComponents(UButton).at(-1);
  context.mockDelete(PROPERTY_API_URL);
  confirmBtn?.vm.$emit(`click`);
  await nextTick();
  // so we need to “find” again to be update-to-date with the DOM
  expect(wrapper.findAllComponents(UButton).at(-1)?.props(`loading`)).toBe(true);
  await flushPromises();
  // same here
  expect(wrapper.findAllComponents(UButton).at(-1)?.props(`loading`)).toBe(false);
});
```

---

============================================================================================

# Mocking Fetch requests 03-mock-fetch-requests

We use [MSW](https://mswjs.io/) to fetch calls during tests (as advised by [Vitest](https://vitest.dev/guide/mocking.html#requests))

The test `context` is enhanced with some utils:

- `context.mockGet`
- `context.mockPost`
- `context.mockPatch`
- `context.mockPut`
- `context.mockDelete`

:::danger Warning  
Urls needs to be the same as what is queried, __search params included!__  
you have the `searchParams` option to ease the writing of those  
:::

::: tip  
Remember that you can debug fetch calls with:  
```
VITE_TEST__DEBUG_FETCH_MOCK=true VITE_TEST__DEBUG_FETCH_BODY=true pnpm test
``` 

see debugging the calls debugging-the-calls
:::

::: warning  
Never make a single `ky().json()`  

✅ Always write it that way for mock queries during tests to work

```ts
queryFn: async () => {
  const req = await EndpointApi(`my-resource/${resourceId}`);
  return req.json<ApiResource>()
},
```
❌ The following won't fetch during tests

```ts
queryFn: async () => EndpointApi(`my-resource/${resourceId}`).json<ApiResource>()
``` 
:::

## GET

```ts
it(`can fetch something`, async (context) => {
  const data = { getTest: true };
  // mock this GET route with those data
  // it will be only possible to call it once
  context.mockGet(`my-get-route`, { data });
  // `ky` request is just provided as an example
  // you will NEVER have to write this 
  // see “In a component” section
  const req = await ky(`http://localhost/my-get-route`);
  const response = await req.json()
  expect(response).toEqual(data);
});
```

## GET with query params

```ts
it(`can fetch something`, async (context) => {
  const data = { getTest: true };
  // mock this GET route with those data
  // Query params should match or the request will not be intercepted
  context.mockGet(`my-get-route`, { data, searchParams: { page: 2 } });
  // `ky` example (do not use in real application code)
  const req = await ky(`http://localhost/my-get-route`, { searchParams: { page: 2 } });
  const response = await req.json();
  expect(response).toEqual(data);
});
```

## GET with error

```ts
// GET with error
it(`can fetch something`, async (context) => {
  const data = { errorCode: 500, errorMessage: `something went wrong` };
  // statusCode is the HTTP code
  context.mockGet(`my-get-route`, { data, statusCode: 500 });
  // `ky` example (do not use in real application code)
  await expect(async () => {
    const req = await ky(`http://localhost/my-get-route`)
    return req.json()
  }).rejects.toThrow(data);
});
```

## GET with headers

```ts
it(`can fetch something`, async (context) => {
  const data = { getTest: true };
  context.mockGet(`my-get-route`, { data, statusCode: 401, responseHeaders: { 'X-SSO-SESSION-ERROR': `login_requested` } });
  // `ky` example (do not use in real application code)
  const { headers } = await ky(`http://localhost/my-get-route`, { searchParams: { page: 2 } });
  expect(headers[`X-SSO-SESSION-ERROR`]).toBe(`login_requested`);
});
```

## POST

```ts
it(`can post something`, async (context) => {
  const data = { postTest: true };
  context.mockPost(`my-post-route`, { data: { foo: true } });
  // `ky` example (do not use in real application code)
  const req = await ky.post(`http://localhost/my-post-route`, { json: { foo: true } });
  const response = await req.json();
  expect(response).toEqual(data);
});
```

## Testing the JSON body

You can trace either by:

```
VITE_TEST__DEBUG_FETCH_BODY=true pnpm test
```

or by adding into `.env.local`:  

```
VITE_TEST__DEBUG_FETCH_BODY=true
```

in your tests: 

```ts
test(`update success`, async (context) => {
  const wrapper = shallowMount(AuthLogin);
  await wrapper.findComponent(UModal).setValue(`bar`);
  // This will return a `400` 
  // when the json send to the API isn't the same as “expectedJson”
  context.mockPut(PUT_API_URL, { expectedJson: { foo: `bar` } });
  await wrapper.findComponent(UButton).trigger(`click`);
  await context.flushPromises();
  // …expects
  expect(routerPushSpy).toHaveBeenCalled();
});
```
## Testing the FormData body

Same `env var` config applies as above

```ts
test(`update success`, async (context) => {
  const wrapper = shallowMount(ValuationFileCard);
  await wrapper.findComponent(UModal).setValue(`bar`);
  // This will return a `400` 
  // when the formData send to the API isn't the same as expectedFormData
  const formData = new FormData()
  formData.append(`foo`, `bar`);
  context.mockPut(PUT_API_URL, { expectedFormData: formData });
  await wrapper.findComponent(UButton).trigger(`click`);
  await context.flushPromises();
  // …expects
  expect(routerPushSpy).toHaveBeenCalled();
});
```

## Testing calls without side effects

It may happens that a query is done without side effects:  
no notifications, no redirection, etc.
(ex: background update for something else)

In that case your only remaining choice will be to check if the mocked request has been (or hasn't been) consumed.
In the text context you will find the MSW server available `context.mockServer`


```ts
// Check if all requests has been consumed
expect(context.mockServer.listHandlers().every(handler => handler.isUsed === true)).toBe(true);

// Check that a specific request has been consumed
expect(context.mockServer.listHandlers()[1].isUsed).toBe(false);

// Check that some requests haven't been consumed
expect(context.mockServer.listHandlers().every(handler => handler.isUsed === true)).toBe(false);
```

## In a component

:::info   
It is important to wait for the request to resolve  
A rule of thumb will be:  
**After each fetch, use `await flushPromises()`**
:::


```ts
import { flushPromises, shallowMount } from '@vue/test-utils';

it(`can fetch something`, async (context) => {
  context.mockGet(`my-get-route`, { data: { getTest: true } });
  // if the call is made on setup (ex: using a vue-query composable)
  const wrapper = shallowMount(MyComponentWithApiCalls);
  // wait for the request to be handled
  await flushPromises();
  expect(wrapper.html()).toMatchSnapshot();
});
```

### If you have the same call on every group of test

Useful if calls are made when initializing the component

```ts
import { flushPromises, shallowMount } from '@vue/test-utils';

describe(`a group of tests`, () => {
  beforeEach((context) => {
    context.mockGet(`my-init-data`, { data: { getTest: true } });
  });

  test(`first`, async (context) => {
    const wrapper = shallowMount(MyComponentWithApiCalls);
    await flushPromises();
    // …the rest of my first test
  });

  test(`second`, async (context) => {
    const wrapper = shallowMount(MyComponentWithApiCalls);
    await flushPromises();
    // …the rest of my second test
  });
});
```

## Prefer using JSON mock for data

:::tip  
It's more convenient to use JSON as mock.  
We can copy/paste a query response.  
This will also act as a reference to the API responses.  
:::

Mocks data could be close to our `vue-query` composable

```
 src
   └─ domain
      └─ composables 
        ├─ __mocks__
        │  └─ my-data.json
        └─ resources
           └─ my-composable.vue
```

We can then use it in our tests

```ts
import { flushPromises, shallowMount } from '@vue/test-utils';

import SomeComponent from './some-component.vue';
import myResourceResponse from '~/domain/composables/__mocks__/my-data.json';

describe(`some component`, () => {
  test(`it fetches something`, async (context) => {
    // send my mock as data
    context.mockGet(`my-resource`, { data: myResourceResponse });
    const wrapper = shallowMount(SomeComponent);
    await flushPromises();
    // my component will be hydrated with `myResourceResponse`
    // …the rest of my test
  });
});
```

## Trigger Vue Query side effects

:::tip  
We will need to run timers for that!
:::

When we need to wait for invalidation done in `onSuccess`:

```ts
test(`update success`, async (context) => {
  vi.useFakeTimers(); // We should fake timers
  context.mockGet(PROPERTY_API_URL, { data: propertyResponse });
  const wrapper = shallowMount(ValuationFileCard);
  await context.flushPromises();
  wrapper.findComponent(UButton).vm.$emit(`files`, FILES);
  await nextTick();
  // first requests
  context.mockPost(VALUATION_API_URL, { data: FILE_UPLOADED });
  context.mockPut(PROPERTY_API_URL, { data: propertyResponseWithValuation });
  await flushPromises();
  // invalidation
  context.mockGet(PROPERTY_API_URL, { data: propertyResponseWithValuation });
  context.mockGet(VALUATION_API_PDF, { data: pdfResponseBlob });
  vi.runAllTimers(); // wait for `queryClient.invalidateQueries` to run
  await context.flushPromises(); // requests
  expect(wrapper.findComponent(FavertonFile).exists()).toBe(true);
  // …expects
});
```

## Debugging the calls

You can trace either by:

```
VITE_TEST__DEBUG_FETCH_MOCK=true pnpm test
```

or adding into `.env.local`:  

```
VITE_TEST__DEBUG_FETCH_MOCK=true
```

You'll have this output in the console:

```
# mock is initialized
📡 MOCK  http://localhost/api/profile/profiles?pageSize=100
    200  GET api/profile/profiles { pageSize: 100 }
# request is ongoing    
🔄 FETCH http://localhost/api/profile/profiles?pageSize=100
         GET api/profile/profiles { pageSize: '100' }
# request has been completed
🔚 DONE  http://localhost/api/profile/profiles?pageSize=100
```

::: tip  
request ongoing log will be done only if you use `defineCookieApi()`/`defineTokenApi()` factory methods  
:::  

## Each call should be consumed

::: info  
Since MSW migration this behavior is broken.    
You still have warnings outputted in the logs.  
:::  

:::warning   
It is important to wait for each mock to be consumed.  
If not, it can have side effects on the next tests!  
**After each test, it will throw if some mocks aren't used**   
:::


See [Undici documentation](https://undici.nodejs.org/#/docs/api/MockAgent?id=mockagentassertnopendinginterceptorsoptions) for more details

```
UndiciError: 1 interceptor is pending:

┌─────────┬────────┬────────────────────────┬─────────────┬─────────────┬────────────┬─────────────┬───────────┐
│ (index) │ Method │        Origin          │    Path     │ Status code │ Persistent │ Invocations │ Remaining │
├─────────┼────────┼────────────────────────┼─────────────┼─────────────┼────────────┼─────────────┼───────────┤
│    0    │ 'GET'  │ 'http://localhost.com' │ '/my-path'  │     200     │    '❌'    │      0      │     1     │
└─────────┴────────┴────────────────────────┴─────────────┴─────────────┴────────────┴─────────────┴───────────┘
```

![The undici error](./assets/undici-error.png)