// dynamic import gg map API
((g) => {
    var h,
        a,
        k,
        p = 'The Google Maps JavaScript API',
        c = 'google',
        l = 'importLibrary',
        q = '__ib__',
        m = document,
        b = window;
    b = b[c] || (b[c] = {});
    var d = b.maps || (b.maps = {}),
        r = new Set(),
        e = new URLSearchParams(),
        u = () =>
            h ||
            (h = new Promise(async (f, n) => {
                await (a = m.createElement('script'));
                e.set('libraries', [...r] + '');
                for (k in g)
                    e.set(
                        k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()),
                        g[k]
                    );
                e.set('callback', c + '.maps.' + q);
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => (h = n(Error(p + ' could not load.')));
                a.nonce = m.querySelector('script[nonce]')?.nonce || '';
                m.head.append(a);
            }));
    d[l]
        ? console.warn(p + ' only loads once. Ignoring:', g)
        : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
    key: 'AIzaSyAZP9odw7JOw7LqqIJXcfNxZIh4qxpEK6I',
    v: 'weekly',
    language: 'vi'
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
});

const { Map } = await google.maps.importLibrary('maps');
const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
const { getLocation, SearchBox } = await google.maps.importLibrary('places');


export { Map, AdvancedMarkerElement, getLocation, SearchBox };