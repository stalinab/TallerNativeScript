import { EventData, Page, Frame, fromObject } from '@nativescript/core';

let pageContext: any;

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const navigationContext = page.navigationContext;

    // Determinamos si es Create o Update
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
    // Aquí iría la lógica de guardado en el Array si fuera necesario
    Frame.topmost().goBack();
}