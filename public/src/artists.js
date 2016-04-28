

var ArtistsBlock = React.createClass({

    loadCommentsFromServer: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
     },

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            <div className="artistsBlock">
            <h1>Artists</h1>
            <ArtistList data={this.state.data} />
            </div>

        );
    }
});



var ArtistList = React.createClass({

        render: function(){
            var artists = this.props.data.map(function(artist) {

                return (
                        <div>
                        <h3> {artist.artistName}</h3>
                        <div> {artist.artistDescription} </div>
                       {artist.imageUrl}
                        <div> <img src={artist.imageUrl} className='img-responsive'/></div>
                        </div>
                );

            });
            return (
                <div className="artistsList">
                    <span> {artists} </span>
                </div>
            );
        }
});

ReactDOM.render(
        <ArtistsBlock url="/api/artists" pollInterval={2000} />,
        document.getElementById('example')
        );
