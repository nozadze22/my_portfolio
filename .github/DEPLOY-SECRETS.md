# GitHub Actions — tokens & deploy

## რა ხდება `main`-ზე push-ისას

1. **CI** — lint, test, build (backend + frontend).
2. CI თუ **green** → **Deploy** — `fly deploy` (`giorgi-portfolio-api`).
3. **Frontend** — Vercel-ზე ჩვეულებრივ **Git-ინტეგრაციით** (ცალკე token Actions-ში არ სჭირდება).

---

## 1. `FLY_API_TOKEN` (აუცილებელი backend deploy-ისთვის)

ლოკალურად:

```powershell
fly auth login
fly tokens create deploy -x 999999h
```

დაბეჭდილი ტოკენი ჩასვი GitHub-ში:

**Repository → Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|------|--------|
| `FLY_API_TOKEN` | `FlyV1 fm2_...` (მთლიანი ხაზი) |

---

## 2. `GITHUB_TOKEN`

Workflow-ებისთვის GitHub **ვაწვდის ავტომატურად** — ხელით არ ქმნი.

---

## 3. Frontend (Vercel) — რეკომენდებული გზა

1. [Vercel Dashboard](https://vercel.com) → **Add Project** → Import `my_portfolio` repo.
2. **Root Directory:** `frontend`
3. **Production Branch:** `main`
4. Environment: `NEXT_PUBLIC_API_URL` = `https://giorgi-portfolio-api.fly.dev`

`main`-ზე push → Vercel თვითონ build + deploy (როგორც ახლა `my-portfolio-ten-livid-38.vercel.app`).

`VERCEL_TOKEN` სჭირდება მხოლოდ თუ deploy-ს **მხოლოდ** Actions-იდან გინდა (არა Git integration).

---

## 4. ტესტი

1. დაამატე `FLY_API_TOKEN` secret.
2. Push `main`-ზე (ან merge PR).
3. GitHub → **Actions** → CI მწვანე → Deploy workflow.
4. Fly: `fly status -a giorgi-portfolio-api`

Manual deploy:

**Actions → Deploy → Run workflow**