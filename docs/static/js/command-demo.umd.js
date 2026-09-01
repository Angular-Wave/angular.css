(function () {
    'use strict';

    document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() !== "j" || (!event.ctrlKey && !event.metaKey)) {
            return;
        }
        event.preventDefault();
        const dialog = document.querySelector("#keyboard-command-dialog-content");
        if (!dialog)
            return;
        if (dialog.open)
            dialog.close();
        else
            dialog.showModal();
    });

})();
