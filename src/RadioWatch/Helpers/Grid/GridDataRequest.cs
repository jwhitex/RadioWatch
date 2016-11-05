namespace RadioWatch.Helpers.Grid
{
    public class GridDataRequest
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string Sort { get; set; }
        public int By { get; set; }
    }
}