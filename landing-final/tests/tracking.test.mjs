import assert from "node:assert/strict";
import test from "node:test";

import { appendTrackingParams, mergeTrackingParams } from "../lib/tracking.mjs";

test("preserva UTMs e fbclid até o checkout", () => {
  const tracking = mergeTrackingParams(
    "?utm_source=instagram&utm_medium=paid&utm_campaign=agosto&fbclid=fb_123",
    "",
  );
  const checkout = new URL(
    appendTrackingParams("https://pay.kiwify.com.br/AUehsBX", tracking),
  );

  assert.equal(checkout.searchParams.get("utm_source"), "instagram");
  assert.equal(checkout.searchParams.get("utm_medium"), "paid");
  assert.equal(checkout.searchParams.get("utm_campaign"), "agosto");
  assert.equal(checkout.searchParams.get("fbclid"), "fb_123");
});

test("mantém parâmetros capturados antes e atualiza somente os novos valores", () => {
  const tracking = mergeTrackingParams(
    "?utm_content=criativo_b",
    "utm_source=meta&utm_campaign=anterior&fbclid=fb_salvo",
  );
  const params = new URLSearchParams(tracking);

  assert.equal(params.get("utm_source"), "meta");
  assert.equal(params.get("utm_campaign"), "anterior");
  assert.equal(params.get("utm_content"), "criativo_b");
  assert.equal(params.get("fbclid"), "fb_salvo");
});

test("não envia parâmetros fora da lista de atribuição", () => {
  const tracking = mergeTrackingParams(
    "?utm_source=meta&email=teste%40exemplo.com&coupon=segredo",
    "",
  );
  const checkout = new URL(
    appendTrackingParams("https://pay.kiwify.com.br/AUehsBX?src=landing", tracking),
  );

  assert.equal(checkout.searchParams.get("src"), "landing");
  assert.equal(checkout.searchParams.get("utm_source"), "meta");
  assert.equal(checkout.searchParams.has("email"), false);
  assert.equal(checkout.searchParams.has("coupon"), false);
});
