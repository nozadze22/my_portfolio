# GitHub Actions — tokens & deploy

## როდის იშვება Actions

| მოვლენა | CI | Deploy (Fly) |
|---------|----|--------------|
| push მხოლოდ `designe`-ზე | არა | არა |
| **PR → `main`** | კი (შემოწმება) | არა |
| **merge / push `main`-ზე** | კი | კი (CI green-ის შემდეგ) |

**Frontend** — Vercel Git integration (`main` push).

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

5. **Fly.io** must have the same **R2** keys as local `backend/.env` and `CORS_ORIGIN` = your Vercel production URL (e.g. `https://my-portfolio-….vercel.app`). See `backend/FLY.md`.

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
