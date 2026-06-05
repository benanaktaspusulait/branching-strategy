# Sistem Durumu, Sorunlar, Cozum Secenekleri Ve Riskler

Bu dokuman, mevcut CI/CD, branching, release ve deployment dokumanlarinin karar vermeye uygun ozetidir.

Amac:

1. Sistemin su anki durumunu netlestirmek.
2. Sorunlari, etkilerini ve kok nedenlerini acikca gostermek.
3. Cozum seceneklerini ve her cozumun risklerini karar seviyesinde ortaya koymak.
4. Benzer CI/CD ve release donusumlerinde gorulen pratik deneyimi bu degerlendirmeye eklemek.

Bu dokuman tek basina detay kaynagi degildir. Detaylar icin mevcut sayfalar esas alinmalidir:

- [Current release operating model](current-release-operating-model.md)
- [Deployment and release findings](deployment-and-release-findings.md)
- [CI/CD deployment findings and actions](cicd-deployment-findings-and-actions.md)
- [Proposed release automation flow](proposed-release-automation-flow.md)
- [Branching strategy options](branching-options.md)
- [Automation and validation](automation-and-validation.md)
- [Hotfix and rollback](hotfix-and-rollback.md)
- [Release scope, ownership and approvals](scope-ownership-approvals.md)
- [Rollout decision proposals](rollout-decision-proposals.md)

## Kisa Karar Ozeti

Net sonuc:

```text
Su anki ana problem sadece branching modeli degil.
Ana problem, release surecinin manuel, parca parca, sahipligi belirsiz ve yeterince denetlenebilir olmamasi.

Branch modelini degistirmeden once release akisi, tag/manifest dogrulamasi, chart update,
hotfix/rollback, environment readiness ve ownership netlesmelidir.
```

Mevcut durum:

- Sistem su anda GitFlow'a yakin bir modelde calisiyor: `feature branch -> development -> release branch -> master / production`.
- Hedef yon, `main` branch'inin production/live baseline olmasi ve release branch'lerinin otomatik olusturulmasi.
- Release artefact yaratmak icin release branch tek basina yetmiyor; tag kritik tetikleyici.
- Helm packaging, manifest update, Cerberus chart update ve deployment akisi hala kismen manuel.
- Automation scriptleri lokal calisiyor; Drone icinde merkezi ve audit edilebilir sekilde calismasi henuz tamamlanmis degil.
- Gareth/Achilles configuration service uzerinde pilot yapiyor.
- Hotfix ve rollback kavramsal olarak tanimli, fakat operasyonel runbook ve reconciliation kurallari henuz yeterince kesin degil.
- Feature flag'ler daha cok deploy-time config/values seviyesinde; runtime flag olgunlugu yok gibi gorunuyor.
- Ownership ve approval matrix henuz tamamen isimlendirilmis degil.

En guvenli yol:

```text
1. Mevcut sureci gorunur ve olculebilir hale getir.
2. Manuel/lokal adimlari Drone'a tasi.
3. Strict validation ekle.
4. Hotfix, rollback ve ownership'i imzali hale getir.
5. Pilot basarili olunca `main = production` modeline kontrollu cutover yap.
6. Daha sonra trunk-based veya daha agresif sadelemeleri tekrar degerlendir.
```

## 1. Sistemin Su Anki Durumu

### 1.1 Branching Ve Release Modeli

Mevcut model:

```text
feature branch
  -> development
  -> release branch
  -> master / production
```

Bu model, su anda aktif surecin en yakin tanimi. `development` aktif gelistirme ve release aday havuzu gibi davranir. Release branch `development` uzerinden kesilir. Production state'in `master` uzerinde temsil edilmesi beklenir.

Hedef model:

```text
main = production/live baseline
release branch = sprint/release adayi
feature/hotfix branch = ilgili release branch'ten acilir
production release sonrasi release state main'e reconcile edilir
```

Bu hedef model dogru yonde, cunku `development` gibi uzun omurlu bir entegrasyon branch'inin maliyetini azaltir. Fakat bu model, ancak automation ve validation yeterince gucluyse guvenli olur.

Deneyime dayali yorum:

Benzer donusumlerde branch modelini erken degistiren ekiplerde sorun cozulmek yerine yer degistirir. Eskiden "hangi branch dogru?" sorusu varken, yeni modelde "hangi chart, hangi tag, hangi manifest production'i temsil ediyor?" sorusu buyur. Bu nedenle branch degisikligi ancak release state'in tek bir kaynaktan izlenebildigi anda yapilmalidir.

### 1.2 Artefact, Tag Ve Deployment Durumu

Release branch, tek basina release artefact uretmiyor. Tag yaratildiginda pipeline:

- repository clone eder,
- build/test calistirir,
- security ve code quality scan yapar,
- Helm package/dependency/upload adimlarini calistirir,
- deploy edilebilir artefact uretir.

Bu yuzden tag timing cok kritik. Yanlis commit'e tag atilirsa, yanlis artefact olusur. Yanlis artefact sonra manifest ve chart update uzerinden environment'a tasinabilir.

Deployment tarafinda:

- Helm chart'lar package olarak deploy ediliyor.
- Environment-specific values dosyalari deploy aninda kullaniliyor.
- Deployment MMA Helm repo scriptleri ve service repo akisi ile ilerliyor.
- Deployment parametreleri environment, scope, release version/tag ve chart isimlerini iceriyor.
- Tum chart'lari deploy etmek icin chart isimleri manuel listelenebiliyor.
- Changed-chart detection hedefleniyor ama production-ready oldugu henuz kanitlanmis degil.

Deneyime dayali yorum:

Artefact ve deployment zincirinde en sik gordugum hata, "branch dogruysa release dogrudur" varsayimidir. Gercekte production'a giden sey branch degil; image, Helm chart, values, secret, manifest ve runbook kombinasyonudur. Bu kombinasyon ayni anda dogrulanmadikca release state guvenilir sayilmaz.

### 1.3 Manifest, JIRA Ve Release Metadata Durumu

Mevcut scriptler:

- release ticket olusturabiliyor,
- manifest olusturabiliyor,
- JIRA release label'larindan ticket bulabiliyor,
- GitLab tag field uzerinden servis version/tag bilgisi okuyabiliyor,
- changelog update edebiliyor,
- branch, commit, push ve MR olusturma adimlarini destekliyor.

Fakat dogrulama politikalari henuz yeterince net degil:

- Wrong tag fail mi warning mi?
- Missing tag fail mi warning mi?
- `do not deploy` marker kesin stop mu?
- `NA` tag entry release report'ta nasil temsil edilecek?
- Invalid ticket status override edilebilir mi?
- Tag jump checker yeni non-linear release branch modelinde kalacak mi?

Deneyime dayali yorum:

Release automation'da "uyari ver ama devam et" yaklasimi kisa vadede rahat gorunur, fakat production incident sonrasinda audit acisindan cok zayiftir. Dogrusu, integrity risklerinde fail-fast davranmak; istisnalari ise named approver, reason ve timestamp ile kaydetmektir.

### 1.4 Environment Durumu

Lower environment'lar daha ad hoc calisiyor. SIT ve ustu ortamlarda release management ve QAT approval daha belirgin.

Bilinen noktalar:

- Shared dev environment hedefleniyor.
- Squad dev/test environment'lari ayri kalacak.
- B.Val/pre-production ve production arasindaki farklar tam dokumante degil.
- Yeni environment icin values files, setup script entries, Drone secrets/tokens ve kube/robot token sahipligi netlesmeli.
- Production access kisitli.
- Bazi adimlar PNR room/location, tools pod veya environment variable/secret gerektirebilir.

Deneyime dayali yorum:

"Pre-prod production'a yakin" ifadesi tek basina yeterli degil. En cok production problemi, pre-prod'da olmayan data shape, permission, network policy, external integration veya resource limit farkindan cikar. Environment parity checklist release gate'in parcasi olmazsa, pre-prod onayi yanlis guven yaratabilir.

### 1.5 Secrets, Config, Feature Flags Ve Liquibase Durumu

Secrets:

- Git-crypt ve managed secrets scriptleri ile yonetiliyor.
- Secret key isimleri environment'lar arasinda ayni, degerler farkli olmali.
- GPG/Git maintainer onboarding gerekiyor.
- Secret exposure durumunda rotation gerekebilir.

Feature flags:

- Daha cok values/config uzerinden deploy-time control seviyesinde.
- Runtime dynamic flag control henuz yok gibi.
- Bu nedenle feature enable/disable icin redeployment gerekebilir.

Liquibase:

- DB degisiklikleri release scope'un parcasidir.
- Bir Liquibase update birden fazla projeyi etkileyebilir.
- Rollback block zorunlulugu net degil.

Deneyime dayali yorum:

Trunk-based veya "deploy ama aktif etme" modeli, feature flag olgunlugu dusukken sanildigi kadar guvenli degildir. Flag degistirmek redeploy gerektiriyorsa, release complexity branch'ten configuration'a tasinmis olur. Bu kotu degil, ama mutlaka kabul edilmis bir operasyonel gercek olmali.

### 1.6 Ownership Ve Approval Durumu

Dokumanlarda ownership ihtiyaci dogru tespit edilmis. Fakat su alanlar henuz net isimlendirilmemis:

- release owner,
- rollback decision owner,
- hotfix approver,
- Drone secret/token owner,
- service ownership owner list,
- environment readiness approver,
- post-release reconciliation owner,
- alert owner.

Pilot automation icin Gareth/Achilles isimleri geciyor. Bu iyi bir baslangic ama rollout icin yeterli degil.

Deneyime dayali yorum:

CI/CD problemlerinde teknik cozumun basarisiz olmasinin en yaygin nedeni tooling degil, ownership boslugudur. "Automation yapacak" cumlesi bir owner degildir. Automation basarisiz oldugunda kimin karar verecegi, kimin override edecegi ve kimin release'i durdurabilecegi isimlendirilmelidir.

## 2. Sorunlar

### P1 - Sorun Yanlis Cercevelenebilir: Ana Problem Branching Degil, Release Operating Model

Durum:

Dokumanlar branch strategy uzerinden baslamis gibi gorunse de gercek problem daha genis: tag, artefact, manifest, Helm chart, secret, config, environment, QAT, rollback ve ownership zinciri.

Etki:

Branch modelini degistirmek tek basina release riskini azaltmaz. Hatta validation ve ownership zayifken daha basit branch modeli daha fazla belirsizlik yaratabilir.

Kok neden:

Release state tek bir yerden okunamiyor. Production'i temsil eden sey branch, manifest, chart, tag, image ve environment config kombinasyonu.

Deneyime dayali yorum:

Bu tip sistemlerde "GitFlow mu trunk-based mi?" sorusu genellikle erken sorulur. Daha dogru soru sudur: "Bir release'in icinde ne oldugunu, kimin onayladigini, hangi artefact'in deploy edildigini ve rollback kararinin nasil verilecegini 5 dakika icinde kanitlayabiliyor muyuz?" Cevap hayirsa branch modeli ikincil kalir.

### P2 - Release Sureci Fazla Manuel Ve Lokal Scriptlere Bagimli

Durum:

Scriptler lokal calisiyor, Drone'a tasinma henuz tamamlanmamis. Chart update, tag handling, server chart work ve deployment trigger tarafinda manuel adimlar var.

Etki:

- Release hazirligi gunler surebilir.
- Ayni adim farkli kisiler tarafindan farkli sekilde calistirilabilir.
- Audit trail eksik kalir.
- Lokal environment farklari release sonucunu etkileyebilir.
- Kidemli developer/release management zamani release plumbing'e harcanir.

Kok neden:

Automation var ama merkezi, tekrarlanabilir ve zorunlu pipeline gate haline gelmemis.

Deneyime dayali yorum:

Lokal calisan release scripti, teknik olarak automation sayilir ama operasyonel olarak hala manuel surectir. Gercek automation, pipeline'da standard input'la calisir, sonucu saklar, log uretir, failure halinde alert yollar ve rerun kurali vardir.

### P3 - Branch, Tag Ve Artefact Timing Kurallari Kesin Degil

Durum:

Release branch olusturma, temporary branch tag, full release tag, chart image update ve manifest update arasindaki sira netlestirilmeli.

Etki:

- Yanlis commit'e tag atilabilir.
- Yanlis image/chart release report'a girebilir.
- Release branch state ile manifest state ayrisabilir.
- Ayni release icinde fix/CVE geldikce tag/version karmasasi buyur.

Kok neden:

Branch lifecycle ve artefact lifecycle ayni sey degil. Dokumanlarda bu ayrim dogru yakalanmis, fakat uygulanacak policy hala proposed durumda.

Deneyime dayali yorum:

Release sistemlerinde tag, production'a giden trenin bileti gibidir. Branch'te dogru kod olsa bile yanlis tag, yanlis image demektir. Bu yuzden tag atma hakki ve tag validation pipeline tarafindan kontrol edilmelidir.

### P4 - Release Scope Net Degil

Durum:

"All services" ifadesi hangi repo ve change type'lari kapsiyor belirsiz:

- service repo,
- Helm chart repo,
- deployment-management,
- manifest,
- secrets/config,
- Liquibase/database,
- runbook,
- shared libraries,
- release metadata/changelog.

Etki:

Automation fazla seyi dahil edebilir, az seyi dahil edebilir veya release-impacting bir config/secret/db degisikligini kacirabilir.

Kok neden:

Release sadece application code olarak dusunulurse deployment reality eksik kalir.

Deneyime dayali yorum:

En riskli release hatalari cogu zaman kod degil config kaynaklidir. "Kod degismedi, sadece values file degisti" cumlesi production icin dusuk risk anlamina gelmez. Values, secrets ve DB migration release scope'ta first-class citizen olmalidir.

### P5 - Manifest Ve Ticket Validation Politikalari Cok Gevsek Kalabilir

Durum:

Wrong tag, missing tag, invalid ticket status, `do not deploy`, `NA`, tag/manifest mismatch gibi durumlarda neyin fail, neyin warning oldugu kesinlesmemis.

Etki:

- Bloke edilmis ticket release'e girebilir.
- Yanlis service version production'a tasinabilir.
- Release report gercegi temsil etmeyebilir.
- Audit ve incident review zayiflar.

Kok neden:

Mevcut scriptler kontrol yapabiliyor, fakat strict policy formalize edilmemis.

Deneyime dayali yorum:

Validation kuralini "sonra bakariz" diye warning yapmak, release yogunlugunda kuralin hic bakilmamasi anlamina gelir. Kritik release integrity kontrolleri fail-fast olmali. Override gerekiyorsa override da release record'un parcasi olmali.

### P6 - Changed-Chart Deployment Henuz Guvenilir Default Degil

Durum:

Hedef, sadece degisen chart'lari deploy etmek. Ancak bugun chart isimleri manuel listelenebiliyor ve umbrella chart yapisi dependency/blast radius analizi gerektiriyor.

Etki:

- Gereksiz chart deploy edilir.
- Degismis chart atlanir.
- Multi-service umbrella chart etkisi yanlis hesaplanir.
- Release owner hangi chart'in neden deploy edildigini kanitlayamayabilir.

Kok neden:

Service change ile chart change birebir ayni sey degil. Umbrella chart bir veya birden fazla service iceriyor.

Deneyime dayali yorum:

Changed-only deployment cok iyi bir default'tur, fakat false negative riski production icin tehlikelidir. "Degismemis gorundu, deploy etmedik" hatasi, "fazla chart deploy ettik" hatasindan daha zor fark edilir. Ilk fazda changed-chart report insan tarafindan review edilmelidir.

### P7 - Hotfix Ve Rollback Operasyonel Olarak Yeterince Standardize Degil

Durum:

Production hotfix ve release-phase hotfix ayrimi dokumante edilmis. Helm rollback teknik olarak mumkun. Fakat rollback otomatik degil; pratik davranis fix-forward'a yakin.

Etki:

- Production fix `main/master`, release branch, manifest ve active release branch'lerden birine islenmeyebilir.
- Rollback sonrasi source control production'i temsil etmeyebilir.
- Liquibase veya secrets/config dahilse rollback karari belirsizlesir.
- Incident aninda ekip karar almakta gecikir.

Kok neden:

Rollback sadece Helm komutu olarak gorulurse eksik kalir. Rollback ayni zamanda source control, manifest, release report, JIRA ve validation isidir.

Deneyime dayali yorum:

Incident aninda yeni surec tasarlanmaz; yalnizca daha once prova edilmis runbook uygulanir. Rollback runbook'u yoksa ekip dogal olarak fix-forward'a kayar. Fix-forward bazen dogrudur, ama karar explicit olmali.

### P8 - Environment Readiness Ve Parity Belirsiz

Durum:

Yeni environment'lar icin values, setup scripts, Drone secrets/tokens ve kube/robot token sahipligi net degil. B.Val/pre-prod ile production farklari tam yazili degil.

Etki:

- Environment var gibi gorunur ama deploy edilemez.
- Pre-prod onayi production riskini gercekten azaltmayabilir.
- Access/secret eksigi release gunu ortaya cikabilir.

Kok neden:

Environment readiness henuz checklist ve gate olarak ele alinmamis.

Deneyime dayali yorum:

Bir environment'in Kubernetes namespace olarak var olmasi, release-ready oldugu anlamina gelmez. Release-ready environment; secrets, values, tokens, network, data shape, permissions ve runbook adimlari ile birlikte tanimlanir.

### P9 - Secrets Ve Config Sureci Scale Ettikce Zorlasabilir

Durum:

Git-crypt ve managed secrets scripts mevcut ve calisabilir bir short-term cozum. Ancak GPG onboarding, maintainer access, secret rotation ve screen sharing riskleri var.

Etki:

- Yeni ekip/maintainer onboarding yavaslar.
- Secret exposure durumunda rotation maliyeti yukselir.
- Environment-specific config farklari audit disinda kalabilir.

Kok neden:

Secret lifecycle merkezi secret manager veya Kubernetes-native model yerine Git/GPG odakli ilerliyor.

Deneyime dayali yorum:

Git-crypt kucuk/orta olcekte iyi bir gecis cozumudur. Fakat ekip ve environment sayisi arttikca asil maliyet encryption degil, key ownership ve rotation olur. Bu nedenle medium-term secret strategy karari simdiden roadmap'e girmeli.

### P10 - Runtime Feature Flag Olgunlugu Yetersizse Trunk-Based Riskli

Durum:

Feature flags daha cok values/config ile deploy-time seviyesinde. Dynamic runtime flag veya merkezi kill-switch olgunlugu dokumante degil.

Etki:

- Incomplete feature'i main'e almak riskli olur.
- Feature disable icin redeployment gerekebilir.
- Trunk-based model config operasyonuna fazla yuk bindirir.

Kok neden:

Deployment ve release birbirinden tam ayrilmamis.

Deneyime dayali yorum:

Trunk-based development, feature flag sistemi olgun oldugunda harika calisir. Flag degistirmek icin chart redeploy gerekiyorsa, ekip aslinda trunk-based degil, "branch yerine config ile release kontrolu" yapiyordur. Bu gecis adimi olabilir ama net adlandirilmalidir.

### P11 - Ownership Ve Approval Eksikleri Teknik Cozumu Zayiflatir

Durum:

Ownership matrix template var, fakat bircok alan TBD. Approval points listelenmis, ancak hangileri mandatory, hangileri automated olacak netlesmemis.

Etki:

- Automation failure kimin sorumlulugunda belirsiz kalir.
- Override kararlarinda baski ve karisiklik olur.
- Rollback/hotfix karar sureleri uzar.
- Release closure yarim kalabilir.

Kok neden:

RACI henuz formal karara donusmemis.

Deneyime dayali yorum:

Basarili release automation projelerinde her kritik adimin tek accountable owner'i vardir. "Platform team bakar" veya "release management halleder" genel ifadeleri incident aninda yeterli olmaz.

### P12 - Alerting Ve Rerun Kurallari Tam Degil

Durum:

Failed automation steps icin alerting modeli henuz tanimli degil. Final Git/chart/reporting step'in idempotent ve rerunnable olmasi oneriliyor.

Etki:

- Pipeline fail olur ama release state yarim kalir.
- Artefact olusmus, chart update olmamis olabilir.
- Manuel chart edit ile rerun conflict yaratabilir.
- Ekip hangi adimin tekrar calistirilacagini bilemeyebilir.

Kok neden:

Failure mode'lar henuz production readiness kriteri haline gelmemis.

Deneyime dayali yorum:

Automation'in basari yolu kadar hata yolu da tasarlanmalidir. "Rerun'a bas" guvenli degilse automation production-ready degildir. Idempotency ve alerting rollout oncesi minimum gereksinim olmalidir.

## 3. Cozum Secenekleri Ve Riskleri

### S1 - Branch Modelini Hemen Degistirme; Once Mevcut Sureci Standardize Et

Ne yapilir:

- Mevcut GitFlow-style model kisa vadede korunur.
- Release branch timing, tag timing, manifest validation, hotfix, rollback ve ownership dokumante edilir.
- Kararlar [Rollout decision proposals](rollout-decision-proposals.md) uzerinden approve/amend edilir.

Fayda:

- En dusuk degisim riski.
- Mevcut ekip aliskanliklari korunur.
- Gercek problemler gorunur hale gelir.
- Sonraki automation icin baseline olusur.

Risk:

- Ekip "branching strategy hala degismedi" diye ilerleme hissini dusuk gorebilir.
- Manuel isler kisa vadede devam eder.
- Decision alma gecikirse dokumanlar proposed seviyede kalir.

Risk azaltma:

- Bu adimi zaman kutusuna al: ornegin 1 sprint icinde karar checklist'i kapat.
- Quick win'leri hemen uygula: strict tag validation, ticket reference hook, deployment parameter documentation.
- Success metric tanimla: release prep time, manual step count, report accuracy.

Deneyime dayali yorum:

Bu en az heyecan verici ama en dogru ilk adimdir. Cunku release surecinde belirsizlik varken branch modelini degistirmek, pusulasiz rota degistirmeye benzer. Once navigasyon cihazini calistirmak gerekir: report, validation, ownership.

### S2 - Lokal Scriptleri Drone'a Tasi Ve Pipeline'i Release'in Tek Giris Kapisi Yap

Ne yapilir:

- Configuration service pilot tamamlanir.
- Scriptler Drone'da standard input ile calisir.
- Build/test/scan, tag, chart update, report generation pipeline tarafindan yurutulur.
- Output pipeline artefact veya release record olarak saklanir.

Fayda:

- Audit trail olusur.
- Lokal environment farklari azalir.
- Release adimlari tekrarlanabilir olur.
- Manual chart update ihtiyaci azalir.
- Release report guvenilirlesir.

Risk:

- Scriptler lokal calissa bile Drone permission, proxy, secret, token veya working directory farki nedeniyle bozulabilir.
- Idempotency eksikse rerun duplicate tag/chart/report uretebilir.
- Pipeline cok sert fail ederse ekip manual workaround'a geri donebilir.
- Drone secret/token ownership net degilse rollout takilir.

Risk azaltma:

- Pilot scope'u dar tut: one service, one release, one squad.
- Rerun senaryolarini bilerek test et.
- Final Git/chart/reporting step icin "safe to rerun" kriterlerini yaz.
- Pipeline output'u release report ile karsilastir.
- Manual fallback'i sadece approved emergency path olarak tut.

Deneyime dayali yorum:

Lokal scriptten pipeline'a geciste en cok unutulan konu permission modelidir. Developer'in lokal makinesinde calisan komut, Drone runner'da token, proxy, git author, GPG veya kube access farki yuzunden durabilir. Pilotun amaci sadece happy path'i degil, bu farklari ortaya cikarmaktir.

### S3 - Strict Tag, Manifest, Ticket Ve Scope Validation Ekle

Ne yapilir:

Fail-fast policy uygulanir:

```text
Wrong tag -> fail
Missing tag -> fail
Manifest/tag mismatch -> fail
Invalid ticket status -> fail or explicit override
Do-not-deploy marker -> fail unless release owner override
Unknown ownership -> fail or release-owner approval
```

`NA` tag entry'leri release report'ta acikca gosterilir. Override'lar approver, reason, timestamp ve risk ile kaydedilir.

Fayda:

- Yanlis artefact production'a gitmeden durur.
- Release report gercegi daha iyi temsil eder.
- Audit ve incident review guclenir.
- Manual kontrol yuku azalir.

Risk:

- Baslangicta cok fazla fail olabilir.
- Mevcut ticket metadata kalitesi dusukse rollout yavaslar.
- False positive'ler ekibi rahatsiz eder.
- Override kulturu iyi yonetilmezse strict validation kagit uzerinde kalir.

Risk azaltma:

- Ilk fazda report-only/dry-run calistir, sonra fail mode'a gec.
- Top 5 validation failure sebebini olc.
- Ticket metadata temizligi icin squad aksiyonu ac.
- Override'lari release owner onayina bagla.

Deneyime dayali yorum:

Strict validation ilk hafta can yakar, ikinci hafta veri kalitesini duzeltir, ucuncu hafta release'e guven getirir. Bu gecis yonetilmezse ekip "pipeline bizi engelliyor" der. Bu yuzden failure'lar egitim ve cleanup backlog'u ile birlikte ele alinmali.

### S4 - `main = Production` Modeline Kontrollu Cutover Yap

Ne yapilir:

- Cutover release belirlenir.
- Production state dogrulanir.
- `main` confirmed production state'ten olusturulur veya `master` rename edilir.
- `development` freeze edilir, sonra archive/delete edilir.
- Branch protections ayarlanir.
- Release branch'ler `main` uzerinden otomatik olusturulur.
- Production release sonrasi release state `main`'e reconcile edilir.

Fayda:

- Production baseline daha net olur.
- `development` kaynakli drift ve reconciliation yuku azalir.
- Future simplified GitFlow modeline gecilir.
- Release branch state ile live baseline arasindaki iliski sade olur.

Risk:

- Yanlis production state'ten `main` olusturulabilir.
- Open work `development` uzerinde kaybolmus gibi hissedilebilir.
- Eski automation/jobs hala `development` veya `master` hedefleyebilir.
- Multiple active release branch forward-merge disiplini kurulmazsa drift devam eder.

Risk azaltma:

- Cutover oncesi repo-by-repo checklist hazirla.
- Branch protection ve pipeline target'lari test et.
- `development` freeze tarihini ve istisnalari duyur.
- Open MR/branch inventory cikar.
- Ilk iki release boyunca reconciliation audit yap.

Deneyime dayali yorum:

`development`'i `main` diye rename etmek genellikle yanlis olur. Dogru olan, `main`'i production'in kanitlanmis state'inden baslatmaktir. Bu ayrim cok onemli; cunku `development` icinde production'a gitmemis isler olabilir.

### S5 - Ticket-Based Multi-Repo Aggregation Ve Changed-Chart Deployment Kullan

Ne yapilir:

- Ayni ticket/branch name ile birden fazla repo degisikligi ayni Cerberus chart branch'inde toplanir.
- Release report chart, image, service, commit, ticket, team ve assignee bilgilerini gosterir.
- Deployment default olarak changed chart'lari deploy eder.
- Chart exclusion sadece release owner approval ve audit note ile yapilir.

Fayda:

- Multi-service feature'lar daha iyi takip edilir.
- Manual chart update azalir.
- "Hangi chart deploy edilmeli?" sorusu otomatik cevaplanir.
- Release blast radius gorunur olur.

Risk:

- Branch/ticket naming tutarsizsa aggregation bozulur.
- Bir ticket baska ticket'a bagimliysa chart branch elle duzenlenmek istenebilir.
- Umbrella chart dependency nedeniyle false positive/false negative olabilir.
- Chart exclusion approval'i zayifsa degisen chart deploy edilmeyebilir.

Risk azaltma:

- Naming rule'u pipeline ile enforce et.
- Cross-ticket dependency policy yaz.
- Changed-chart detection'i ilk fazda human review ile calistir.
- Mass diff output'u release approval'in zorunlu parcasi yap.
- Exclusion reason ve follow-up action zorunlu olsun.

Deneyime dayali yorum:

Ticket-based aggregation, multi-repo release'lerde cok ise yarar; fakat "ticket number is identity" varsayimina dayanir. Commit, branch, Jira ve MR metadata ayni dili konusmuyorsa sistem dagilir. Bu nedenle metadata hijyeni cozumun on kosuludur.

### S6 - Hotfix Ve Rollback Runbook'unu Production Gate Yap

Ne yapilir:

- Production hotfix ve release-phase hotfix akisi kesinlestirilir.
- Rollback vs fix-forward decision guide kullanilir.
- Rollback sonrasinda `main`, manifest, release report, JIRA ve active release branch'ler reconcile edilir.
- Liquibase rollback/fix-forward policy release report'ta gorunur olur.
- Rollback prova edilir.

Fayda:

- Incident aninda karar hizlanir.
- Production state ile source control uyumu korunur.
- Hotfix drift azalir.
- DB/config/secrets etkisi gorunur olur.

Risk:

- Rollback teknik olarak mumkun olsa bile DB/data nedeniyle guvensiz olabilir.
- Runbook prova edilmezse kagit uzerinde kalir.
- `main` veya manifest'i rollback state'e getirme operasyonu tartismali olabilir.
- Fix-forward karari fazla kolay verilebilir.

Risk azaltma:

- Rollback tabletop exercise yap.
- Helm rollback + manifest reconciliation dry-run calistir.
- Liquibase iceren release'lerde rollback block veya "no rollback" justification zorunlu tut.
- Hotfix time budget belirle: ornegin 4 saat icinde fix yoksa rollback karari tekrar degerlendirilsin.

Deneyime dayali yorum:

Rollback karari teknik oldugu kadar is karari da olabilir. Kullanici etkisi yuksekse, "birazdan fix gelir" demek tehlikelidir. Belirli bir time budget yoksa fix-forward sonsuza kadar uzayabilir.

### S7 - Ownership, Approval Ve RACI'yi Isimlendir

Ne yapilir:

- Her kritik release aktivitesi icin Responsible, Accountable, Consulted, Informed belirlenir.
- Tek accountable owner kurali uygulanir.
- CODEOWNERS/branch protection ile approval otomatik atanir.
- Alert owner, rollback approver ve release closure owner isimlendirilir.

Fayda:

- Karar gecikmesi azalir.
- Override ve exception'lar denetlenebilir olur.
- Ekipler kendi sorumluluklarini bilir.
- Automation failure sahipsiz kalmaz.

Risk:

- Fazla approval gate release'i yavaslatabilir.
- Owner bulunamazsa surec yine informal kalir.
- Bazi ekipler "bu release management isi" diyerek sorumluluktan kacabilir.

Risk azaltma:

- Her gate'i mandatory yapma; sadece riskli noktalar icin approval iste.
- Default owner modeli kur: platform tooling'den, squad service behavior'dan sorumlu.
- Backup owner belirle.
- Approval SLA yaz.

Deneyime dayali yorum:

RACI'nin degeri tablo olmasinda degil, incident aninda tartismayi bitirmesindedir. "Bu karari kim verir?" sorusunun cevabi bir rolde ve isimde yoksa RACI tamamlanmis sayilmaz.

### S8 - Feature Flag Ve Config Olgunlugunu Medium-Term Roadmap'e Al

Ne yapilir:

- Deploy-time flag mevcut haliyle standardize edilir.
- Flag owner, removal date ve environment state release report'a eklenir.
- Critical kill-switch icin redeploy gerektirmeyen yol degerlendirilir.
- Runtime flag platformu medium-term opsiyon olarak incelenir.

Fayda:

- Deployment ve release ayrimi guclenir.
- Incomplete feature'lar daha guvenli saklanir.
- Trunk-based veya release branch optional modele hazirlik olur.
- Production'da hizli disable mumkun hale gelir.

Risk:

- Runtime flag platformu ek operational dependency getirir.
- Flag debt birikir.
- Yanlis flag state production'da feature'i istemeden acabilir/kapatabilir.
- Security/compliance acisindan flag audit gerekebilir.

Risk azaltma:

- Her flag icin owner ve expiry date zorunlu yap.
- Environment flag state release report'a yaz.
- Critical flag change icin approval/audit kullan.
- 2 release'ten eski flag'leri review et.

Deneyime dayali yorum:

Feature flag sistemi yoksa trunk-based'e gecilmez demek dogru degil; ama trunk-based'in vaat ettigi guvenlik saglanmaz. Asil hedef "kod deploy edildi" ile "ozellik kullaniciya acildi" kararlarini ayirmaktir.

### S9 - Secrets Management Icin Kademeli Modernizasyon Planla

Ne yapilir:

- Short term: managed secrets scripts + Drone secrets devam eder.
- Medium term: External Secrets Operator veya Sealed Secrets degerlendirilir.
- Long term: Vault/AWS Secrets Manager gibi merkezi secret manager secenegi incelenir.

Fayda:

- Rotation ve audit guclenir.
- GPG onboarding maliyeti azalir.
- Runtime secret delivery daha standart hale gelir.
- Secret exposure response hizlanir.

Risk:

- Yeni controller/infrastructure dependency olusur.
- Migration sirasinda secret path/name uyumsuzluklari cikabilir.
- Platform team'e ek operasyon yuku gelir.
- Access model yanlis tasarlanirsa security riski artar.

Risk azaltma:

- Once non-production environment'ta pilot yap.
- Secret inventory cikar.
- Rotation runbook yaz.
- Eski ve yeni modelin birlikte calistigi gecis penceresini sinirla.

Deneyime dayali yorum:

Secret management'i release automation ile ayni anda kokten degistirmek fazla riskli olur. Dogru sira: once mevcut release'i otomatik ve denetlenebilir yap, sonra secret lifecycle'i iyilestir.

## 4. Onerilen Yol Haritasi

### Faz 0 - Karar Ve Baseline

Sure: hemen / bu sprint

Yapilacaklar:

1. Rollout decision proposals uzerindeki 14 karar approve/amend edilir.
2. Repository scope listesi cikarilir.
3. Service ownership listesi cikarilir.
4. Hotfix/rollback owner'lari isimlendirilir.
5. Validation policy fail vs warning olarak kesinlestirilir.

Cikis kriteri:

```text
Release surecinde neyin otomasyon, neyin approval, neyin exception oldugu yazili ve sahipli.
```

### Faz 1 - Quick Wins

Sure: bu sprint / sonraki sprint

Yapilacaklar:

1. Ticket reference pre-commit/MR validation etkinlestirilir.
2. Wrong tag/missing tag strict mode dry-run baslatilir.
3. Deployment parameters dokumante edilir.
4. Release report'ta changed chart listesi gosterilir.
5. Alert content template hazirlanir.

Cikis kriteri:

```text
Release report gercegi anlatmaya baslar; metadata hatalari gorunur olur.
```

### Faz 2 - Drone Pilot

Sure: configuration service pilot release'i

Yapilacaklar:

1. Lokal scriptler Drone'da calistirilir.
2. Tag, chart update, report generation dogrulanir.
3. Rerun senaryolari test edilir.
4. Manual chart conflict senaryosu test edilir.
5. Pilot sonucu squad'larla paylasilir.

Cikis kriteri:

```text
Bir servis icin release plumbing merkezi pipeline'da, audit edilebilir ve rerunnable hale gelir.
```

### Faz 3 - Kontrollu Branch Cutover

Sure: pilot basarili olduktan sonra belirlenen cutover release

Yapilacaklar:

1. Confirmed production state secilir.
2. `main` production baseline olarak olusturulur.
3. `development` freeze edilir.
4. Branch protections ve CODEOWNERS uygulanir.
5. Release branches otomatik olusturulur.
6. Production release sonrasi `main` reconciliation gate olur.

Cikis kriteri:

```text
`main` production'i temsil eder; release branch'ler kisa omurlu ve otomasyonla yonetilir.
```

### Faz 4 - Scale-Out

Sure: 2-3 squad -> tum squadlar

Yapilacaklar:

1. More services onboard edilir.
2. Changed-chart deployment default olur.
3. Exclusion approval audit edilir.
4. Shared dev deployment manual trigger'dan scheduled/event trigger'a ilerler.
5. Release metrics izlenir.

Cikis kriteri:

```text
Manual release step sayisi belirgin azalir ve release report accuracy yukselir.
```

### Faz 5 - Optimize

Sure: medium-term

Yapilacaklar:

1. Runtime feature flags degerlendirilir.
2. Secret management modernizasyonu pilotlanir.
3. Progressive delivery/canary opsiyonlari incelenir.
4. Tag jump checker yeni validation iki release green olduktan sonra retire edilir.

Cikis kriteri:

```text
Release kontrolu branch'ten yavas yavas runtime config ve progressive delivery olgunluguna tasinabilir.
```

## 5. Go / No-Go Kriterleri

### Branch Cutover Icin Go

Cutover yapilabilir, eger:

- confirmed production state belli,
- `main` branch protection hazir,
- automation target branch'leri dogru,
- release branch naming onayli,
- rollback/hotfix flow onayli,
- release owner ve backup owner belli,
- strict validation en az pilotta basarili,
- open work inventory cikarilmis,
- `development` freeze plani duyurulmus.

### Branch Cutover Icin No-Go

Cutover yapilmamali, eger:

- production state'in hangi branch/tag/manifest ile temsil edildigi belirsizse,
- Drone automation pilotu henuz green degilse,
- `development` icindeki open work bilinmiyorsa,
- hotfix forward-merge sahibi yoksa,
- manifest/tag validation warning seviyesinde kalacaksa,
- rollback sonrasi `main` ve manifest nasil reconcile edilecek belli degilse.

### Automation Production Rollout Icin Go

Rollout yapilabilir, eger:

- pipeline logs ve report saklaniyor,
- rerun kurali test edildi,
- failure alerting hazir,
- manual chart edit policy yazildi,
- Drone secrets/tokens hazir,
- changed-chart report human review'den gecti,
- squadlar rollout input sorularini cevapladi.

### Automation Production Rollout Icin No-Go

Rollout ertelenmeli, eger:

- script sadece lokal calisiyorsa,
- pipeline failure sessiz kaliyorsa,
- rerun duplicate artefact uretme riski tasiyorsa,
- release report actual chart/manifest state ile uyusmuyorsa,
- owner ve approval belirsizse.

## 6. En Kritik Kararlar

Bu kararlar alinmadan dokumanlar "iyi proposal" seviyesinde kalir, operating model seviyesine gecemez:

| No | Karar | Neden Kritik |
| --- | --- | --- |
| 1 | `main` production baseline olacak mi, ne zaman? | Branch modelinin temeli. |
| 2 | Release branch hangi source'tan ve ne zaman kesilecek? | Release scope ve conflict kontrolu. |
| 3 | Wrong/missing tag kesin fail mi? | Release integrity. |
| 4 | `do not deploy` override edilebilir mi, kim eder? | Governance ve audit. |
| 5 | Changed chart exclusion'i kim onaylar? | Production blast radius. |
| 6 | Rollback mi fix-forward mu kararini kim verir? | Incident response hizi. |
| 7 | Liquibase rollback policy ne? | DB risk yonetimi. |
| 8 | Drone secret/token owner kim? | Environment readiness. |
| 9 | Release report nerede saklanir ve ne kadar tutulur? | Audit ve incident review. |
| 10 | Tag jump checker ne zaman retire edilir? | Eski/yeni validation cakismasi. |

## 7. Sonuc

Dokuman seti iyi yonde ilerlemis: mevcut durum, problemler ve proposed decision'lar artik gorunur. En buyuk eksik teknik bilgi degil; kararlarin onaylanip operating model haline getirilmesi.

Benim net onerim:

```text
Branch modelini hemen degistirmeyin.
Once Drone pilot, strict validation, ownership ve rollback/hotfix runbook'u tamamlayin.
Pilot iki release boyunca guven verirse `main = production` cutover yapin.
Trunk-based veya runtime-flag agirlikli modele ise ancak feature flag, test automation,
rollback ve environment parity olgunlugu arttiktan sonra gecin.
```

Bu siralama en hizli gorunen yol olmayabilir, ama production release riskini en kontrollu azaltan yoldur.

---

<- [README](../README.md) | -> [Rollout decision proposals](rollout-decision-proposals.md)
