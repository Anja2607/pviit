# Ovo je aplikacija za pretragu recepata

Projekat za ispit iz predmeta Praktikum - Internet i Veb tehnologije.

Broj indeksa: 2018201289
Ime i prezime: Anja Raspopović
Školska godina: 2022/2023

## Projektni zahtev

Aplikacija treba da omogući administratorima da postavljaju recepte za razna jela. Samo prijavljeni korisnici, koji se na portal prijave sa ispravnih parametrima naloga administratora sadržaja mogu da pristupe administrativnom panelu portala. U ovom panelu mogu da dodaju novi recept koji se sastoji od naslova, slike, detaljnog opisa postupka pripreme, kao i liste sastojaka koja se, zajedno sa količinom, formira u vidu tagova, tj. obeležja. Svaki sastojak, ako postoji u listi tagova je uvezuje kao jedan od sastojaka koji su potrebni za novi recept. Uz formiranje veze između recepta i sastojka se čuva i podatak o količini sastojka. Ovakve veze se prave za svaki od sastojaka. Ako sastojak ne postoji u bazi, tj. ne postoji taj tag, prvo se kreira zapis u adekvatnoj tabeli, pa se onda kreira veza. Sa korisničke strane aplikacije, prikazuje se lista recepata sa slikom i nazivom recepta. Svaki recept može da bude upisan u jednu ili više kategorija, što se vrši prilikom dodavanja recepta u bazu od strane administratora. Kada korisnik otvori recept, recept treba da bude prikazan na pregledan način, a lista sastojaka se generiše dinamički na osnovu tagova i količina pripisanih za svaki tag (sastojak). Kada korisnik klikne na neki od tagova u listi, aplikacija treba da ga odvede na listu svih recepata jela u čiji sastav ulazi taj sastojak, tj. za koji je to tag. Treba implementirati i vrstu pretrage gde korisnik može da navede više tagova, tj. sastojaka za koje želi da vrši pretragu baze podataka recepata i aplikacija treba da prikaže samo one recepte za koje su potrebni svi od navedenih sastojaka, tj. sa kojima je vezan svaki od navedenih tagova i to da budu sortirani na taj način da se prikazuju prvo recepti u koje ulazi najveća količina navedenih sastojaka (suma). Grafički interfejs veb sajta treba da bude realizovan sa responsive dizajnom.

## Tehnička ograničenja

- Aplikacija mora da bude realizovana na Node.js platformi korišćenjem Express biblioteke. Aplikacija mora da bude podeljena u dve nezavisne celine: back-end veb servis (API) i front-end (GUI aplikacija). Sav kôd aplikacije treba da bude organizovan u jednom Git spremištu u okviru korisničkog naloga za ovaj projekat, sa podelom kao u primeru zadatka sa vežbi.
- Baza podataka mora da bude relaciona i treba koristiti MySQL ili MariaDB sistem za upravljanje bazama podataka (RDBMS) i u spremištu back-end dela aplikacije mora da bude dostupan SQL dump strukture baze podataka, eventualno sa inicijalnim podacima, potrebnim za demonstraciju rada projekta.
- Back-end i front-end delovi projekta moraju da budi pisani na TypeScript jeziku, prevedeni TypeScript prevodiocem na adekvatan JavaScript. Back-end deo aplikacije, preveden na JavaScript iz izvornog TypeScript koda se pokreće kao Node.js aplikacija, a front-end deo se statički servira sa rute statičkih resursa back-end dela aplikacije i izvršava se na strani klijenta. Za postupak provere identiteta korisnika koji upućuje zahteve back-end delu aplikacije može da se koristi mehanizam sesija ili JWT (JSON Web Tokena), po slobodnom izboru.
- Sav generisani HTML kôd koji proizvodi front-end deo aplikacije mora da bude 100% validan, tj. da prođe proveru W3C Validatorom (dopuštena su upozorenja - Warning, ali ne i greške - Error). Grafički korisnički interfejs se generiše na strani klijenta (client side rendering), korišćenjem React biblioteke, dok podatke doprema asinhrono iz back-end dela aplikacije (iz API-ja). Nije neophodno baviti se izradom posebnog dizajna grafičkog interfejsa aplikacije, već je moguće koristiti CSS biblioteke kao što je Bootstrap CSS biblioteka. Front-end deo aplikacije treba da bude realizovan tako da se prilagođava različitim veličinama ekrana (responsive design).
- Potrebno je obezbediti proveru podataka koji se od korisnika iz front-end dela upućuju back-end delu aplikacije. Moguća su tri sloja zaštite i to: (1) JavaScript validacija vrednosti na front-end-u; (2) Provera korišćenjem adekvatnih testova ili regularnih izraza na strani servera u back-end-u (moguće je i korišćenjem izričitih šema - Schema za validaciju ili drugim pristupima) i (3) provera na nivou baze podataka korišćenjem okidača nad samim tabelama baze podataka.
- Neophodno je napisati prateću projektnu dokumentaciju o izradi aplikacije koja sadrži (1) model baze podataka sa detaljnim opisom svih tabela, njihovih polja i relacija; (2) dijagram baze podataka; (3) dijagram organizacije delova sistema, gde se vidi veza između baze, back-end, front-end i korisnika sa opisom smera kretanja informacija; (4) popis svih aktivnosti koje su podržane kroz aplikaciju za sve uloge korisnika aplikacije prikazane u obliku Use-Case dijagrama; kao i (5) sve ostale elemente dokumentacije predviđene uputstvom za izradu dokumentacije po ISO standardu.
- Izrada oba dela aplikacije (projekata) i promene kodova datoteka tih projekata moraju da bude praćene korišćenjem alata za verziranje koda Git, a kompletan kôd aplikacije bude dostupan na javnom Git spremištu, npr. na besplatnim GitHub ili Bitbucket servisima, jedno spremište za back-end projekat i jedno za front-end projekat. Ne može ceo projekat da bude otpremljen u samo nekoliko masovnih Git commit-a, već mora da bude pokazano da je projekat realizovan u kontinuitetu, da su korišćene grane (branching), da je bilo paralelnog rada u više grana koje su spojene (merging) sa ili bez konflikata (conflict resolution).

## Baza podataka

...

## Use-case dijagram

...

### Uloge korisnika

**Administrator**

...

**Korisnik**

...