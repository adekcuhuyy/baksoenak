// ui.js — semua fungsi render DOM. Data dinamis selalu ditulis dengan textContent.

import { CATEGORIES, SORT_OPTIONS, assetUrl, formatRupiah } from './products.js';
import { getWhatsappNumber } from './store.js';

const byId = (id) => document.getElementById(id);

let toastTimer = null;

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function stockLabel(stok) {
  return stok > 0 ? `Stok: ${stok}` : 'Stok: Habis';
}

function whatsappHref(product) {
  const message = `Halo, saya mau pesan ${product.nama} (${formatRupiah(product.harga)}).`;
  return `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(message)}`;
}

function createImage(product) {
  const image = node('img', 'card__image');
  image.src = assetUrl(product.imageUrl);
  image.alt = `Foto ${product.nama}`;
  image.loading = 'lazy';
  image.addEventListener('error', () => {
    if (image.dataset.fallback) return;
    image.dataset.fallback = '1';
    image.src = assetUrl('images/placeholder.svg');
  });
  return image;
}

function createWhatsappButton(product) {
  const link = node('a', 'btn btn--wa');
  link.href = whatsappHref(product);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', `Pesan ${product.nama} via WhatsApp`);

  const icon = node('span', 'btn__icon', '🟢');
  icon.setAttribute('aria-hidden', 'true');
  link.append(icon, node('span', '', 'Pesan via WhatsApp'));
  return link;
}

export function createProductCard(product) {
  const card = node('article', 'card');
  card.appendChild(createImage(product));

  const body = node('div', 'card__body');

  const chips = node('div', 'card__chips');
  if (product.unggulan) {
    chips.appendChild(node('span', 'badge badge--unggulan', '⭐ Unggulan'));
  }
  chips.appendChild(node('span', 'chip chip--kategori', product.kategori));
  body.appendChild(chips);

  body.appendChild(node('h3', 'card__title', product.nama));
  body.appendChild(node('p', 'card__desc', product.deskripsi));

  const meta = node('div', 'card__meta');
  meta.appendChild(node('span', 'card__price', formatRupiah(product.harga)));
  const stockClass = product.stok > 0 ? 'stock stock--ok' : 'stock stock--habis';
  meta.appendChild(node('span', stockClass, stockLabel(product.stok)));
  body.appendChild(meta);

  body.appendChild(createWhatsappButton(product));
  card.appendChild(body);
  return card;
}

export function populateControls() {
  const categoryFilter = byId('categoryFilter');
  ['Semua', ...CATEGORIES].forEach((category) => {
    const option = node('option', '', category);
    option.value = category;
    categoryFilter.appendChild(option);
  });

  const sortSelect = byId('sortSelect');
  SORT_OPTIONS.forEach((item) => {
    const option = node('option', '', item.label);
    option.value = item.value;
    sortSelect.appendChild(option);
  });

  const formCategory = byId('fieldKategori');
  CATEGORIES.forEach((category) => {
    const option = node('option', '', category);
    option.value = category;
    formCategory.appendChild(option);
  });
}

export function renderProducts(products) {
  const grid = byId('productGrid');
  grid.replaceChildren();
  products.forEach((product) => grid.appendChild(createProductCard(product)));
}

export function renderEmptyState(isEmpty) {
  byId('emptyState').hidden = !isEmpty;
}

export function renderResultCount(visible, total) {
  byId('resultCount').textContent = `Menampilkan ${visible}/${total} menu`;
}

export function renderSummary(products) {
  const totalStok = products.reduce((sum, product) => sum + product.stok, 0);
  const totalUnggulan = products.filter((product) => product.unggulan).length;
  byId('statProducts').textContent = String(products.length);
  byId('statStock').textContent = String(totalStok);
  byId('statFeatured').textContent = String(totalUnggulan);
  byId('listCount').textContent = `(${products.length})`;
}

function createActionButtons(product, handlers) {
  const group = node('div', 'row-actions');

  const edit = node('button', 'icon-btn', '✎');
  edit.type = 'button';
  edit.setAttribute('aria-label', `Ubah ${product.nama}`);
  edit.addEventListener('click', () => handlers.onEdit(product.id));

  const remove = node('button', 'icon-btn icon-btn--danger', '🗑');
  remove.type = 'button';
  remove.setAttribute('aria-label', `Hapus ${product.nama}`);
  remove.addEventListener('click', () => handlers.onDelete(product.id));

  group.append(edit, remove);
  return group;
}

export function renderDashboardList(products, handlers) {
  const table = node('table', 'product-table');
  const head = node('thead');
  const headRow = node('tr');
  ['Nama', 'Kategori', 'Harga', 'Stok', 'Aksi'].forEach((label) => {
    headRow.appendChild(node('th', '', label));
  });
  head.appendChild(headRow);
  table.appendChild(head);

  const body = node('tbody');
  products.forEach((product) => {
    const row = node('tr');

    const nameCell = node('td');
    nameCell.appendChild(node('span', 'table-name', product.nama));
    if (product.unggulan) {
      nameCell.appendChild(node('span', 'badge badge--unggulan', '⭐ Unggulan'));
    }
    row.appendChild(nameCell);

    row.appendChild(node('td', '', product.kategori));
    row.appendChild(node('td', '', formatRupiah(product.harga)));
    row.appendChild(node('td', '', stockLabel(product.stok)));

    const actionCell = node('td');
    actionCell.appendChild(createActionButtons(product, handlers));
    row.appendChild(actionCell);
    body.appendChild(row);
  });
  table.appendChild(body);
  byId('productTableWrap').replaceChildren(table);

  const mobileWrap = byId('productCardsWrap');
  mobileWrap.replaceChildren();
  products.forEach((product) => {
    const item = node('article', 'mobile-product');

    const headRow = node('div', 'mobile-product__head');
    headRow.appendChild(node('span', 'table-name', product.nama));
    if (product.unggulan) {
      headRow.appendChild(node('span', 'badge badge--unggulan', '⭐ Unggulan'));
    }
    item.appendChild(headRow);

    item.appendChild(
      node('p', 'mobile-product__meta', `${product.kategori} · ${formatRupiah(product.harga)}`),
    );

    const foot = node('div', 'mobile-product__foot');
    const stockClass = product.stok > 0 ? 'stock stock--ok' : 'stock stock--habis';
    foot.appendChild(node('span', stockClass, stockLabel(product.stok)));
    foot.appendChild(createActionButtons(product, handlers));
    item.appendChild(foot);

    mobileWrap.appendChild(item);
  });
}

export function renderErrors(errors = {}) {
  const form = byId('productForm');
  form.querySelectorAll('[data-error-for]').forEach((element) => {
    const field = element.dataset.errorFor;
    const message = errors[field] || '';
    element.textContent = message;
    const input = form.elements[field];
    if (input) {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  });
}

export function getFormValues() {
  const form = byId('productForm');
  return {
    nama: form.elements.nama.value,
    kategori: form.elements.kategori.value,
    harga: form.elements.harga.value,
    stok: form.elements.stok.value,
    deskripsi: form.elements.deskripsi.value,
    imageUrl: form.elements.imageUrl.value,
    unggulan: form.elements.unggulan.checked,
  };
}

export function fillForm(product) {
  const form = byId('productForm');
  form.elements.nama.value = product.nama;
  form.elements.kategori.value = product.kategori;
  form.elements.harga.value = String(product.harga);
  form.elements.stok.value = String(product.stok);
  form.elements.deskripsi.value = product.deskripsi;
  form.elements.imageUrl.value = product.imageUrl;
  form.elements.unggulan.checked = product.unggulan;
  renderErrors({});
}

export function clearForm() {
  byId('productForm').reset();
  renderErrors({});
}

export function setEditingState(isEditing) {
  byId('submitButton').textContent = isEditing ? 'Simpan Perubahan' : 'Simpan';
}

export function showToast(message) {
  const toast = byId('toast');
  toast.textContent = message;
  toast.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

export function setView(view) {
  const target = view === 'dashboard' ? 'dashboard' : 'katalog';

  document.querySelectorAll('[data-view-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== target;
  });

  document.querySelectorAll('[data-view-link]').forEach((link) => {
    const isActive = link.dataset.viewLink === target;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
