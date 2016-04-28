var ArtistsBox = React.createClass({

    render: function(){
        return (
            <div className="artistsBox">
            <h1>Artists</h1>
            </div>

        );
    }
});

ReactDOM.render(
        <ArtistsBox url="/api/artists" pollInterval={2000} />,
        document.getElementById('example')
        );
