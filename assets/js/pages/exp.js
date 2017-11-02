

export default {
    init() {
        this.homeFunction();
    },
    homeFunction(){


        $('section *').each((i, e) => {
            $(e).css('background-color', `rgb(${Math.floor(Math.random() * (256))}, ${Math.floor(Math.random() * (256))}, ${Math.floor(Math.random() * (256))})`);
        });

        // $('.contain').objectFit('contain');
        // $('.cover').objectFit({ type: 'cover', hideOverflow: true});
    },



}