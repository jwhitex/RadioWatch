using System.Collections.Generic;

namespace RadioWatch.Helpers.Grid
{
    public class GridDataResponse<T>
    {
        public List<T> Data { get; set; }
        public int Total { get; set; }
    }
}