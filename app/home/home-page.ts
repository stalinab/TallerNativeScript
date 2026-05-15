import { EventData, Page, Application, Utils } from '@nativescript/core';

let currentPage: Page;

export function navigatingTo(args: EventData) {
    currentPage = <Page>args.object;
    
    // Carga inicial
    loadResources();

    // Detección de cambios de hardware (rotación/idioma)
    Application.on(Application.orientationChangedEvent, () => {
        setTimeout(() => loadResources(), 150);
    });
}

function loadResources() {
    if (!Application.android) return;

    const context = Utils.android.getApplicationContext();
    const res = context.getResources();
    const pkg = context.getPackageName();

    // Punteros a la memoria nativa
    const textId = res.getIdentifier("dynamic_text", "string", pkg);
    const textColorId = res.getIdentifier("text_color", "color", pkg);
    const bgColorId = res.getIdentifier("bg_color", "color", pkg);

    if (textId === 0 || textColorId === 0 || bgColorId === 0) return;

    // Componentes de la interfaz
    const label = currentPage.getViewById("dynamicLabel") as any;
    const container = currentPage.getViewById("container") as any;

    if (label && container) {
        label.text = context.getString(textId);
        label.style.color = "#" + (context.getColor(textColorId) & 0x00FFFFFF).toString(16).padStart(6, '0');
        container.style.backgroundColor = "#" + (context.getColor(bgColorId) & 0x00FFFFFF).toString(16).padStart(6, '0');
    }
}