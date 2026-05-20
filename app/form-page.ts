import { EventData, Page, Frame, fromObject } from '@nativescript/core';

let pageContext: any;

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const navigationContext = page.navigationContext;

    // Detectamos si recibimos un item (Update) o está vacío (Create)
    if (navigationContext && navigationContext.item) {
        pageContext = fromObject({
            isUpdate: true,
            title: navigationContext.item.title,
            subtitle: navigationContext.item.subtitle,
            isActive: true
        });
    } else {
        pageContext = fromObject({
            isUpdate: false,
            title: "",
            subtitle: "",
            isActive: false
        });
    }
    
    page.bindingContext = pageContext;
}

export function onSave() {
    // Al ser un Mock-CRUD, solo simulamos guardado y regresamos
    Frame.topmost().goBack();
}