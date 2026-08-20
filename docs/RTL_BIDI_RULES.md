# Persian RTL and BiDi rules

The document direction is always Persian RTL: `<html lang="fa" dir="rtl">`. Direction must then be applied to the smallest meaningful text run when content mixes writing systems. Never apply a global `unicode-bidi` override or force all Latin text to RTL.

## Implementation rules

1. Keep normal Persian prose in the inherited RTL context.
2. Wrap an embedded name or term whose direction is known with `<bdi dir="ltr">…</bdi>`. Use `dir="rtl"` for an explicitly Persian isolated run.
3. Use `<bdi dir="auto">…</bdi>` for user-entered or API-provided text whose direction is not known in advance.
4. Render standalone Latin UI labels, SKUs, model numbers, URLs, and code with `dir="ltr"`; align them according to the surrounding layout rather than changing their text direction.
5. Isolate numeric/price runs so adjacent Persian punctuation cannot reorder them. Keep the number and currency unit in one intentional run.
6. CSS isolation belongs only on reusable isolated runs (`unicode-bidi: isolate`), never on the document or every element.
7. Prefer logical CSS properties such as `margin-inline-start`, `padding-inline`, and `inset-inline-end` over physical left/right properties.

`BidiText` in `apps/web/src/components/bidi-text.tsx` provides the shared isolation primitive.

## Examples

Persian sentence with an English brand:

```tsx
<p>محصول جدید <BidiText dir="ltr">Funko Pop!</BidiText> رسید.</p>
```

Anime or game title inside Persian prose:

```tsx
<p>کالکشن <BidiText dir="ltr">Jujutsu Kaisen</BidiText> را ببینید.</p>
```

Price and numeric value:

```tsx
<span>قیمت: <BidiText dir="ltr">۱٬۲۵۰٬۰۰۰ ریال</BidiText></span>
```

Standalone English label:

```tsx
<span dir="ltr">Limited Edition</span>
```

SKU or model text:

```tsx
<code dir="ltr">SKU: BCH-GOJ-001</code>
```

Search input containing Persian and English:

```tsx
<input dir="auto" type="search" defaultValue="فیگور Gojo Satoru" />
```

Do not split individual words into many directional spans unless an actual reordering issue requires it. Isolation should preserve meaningful phrases.
